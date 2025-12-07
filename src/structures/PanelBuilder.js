// components v2 için gerekli flag
const IS_COMPONENTS_V2 = 1 << 15;

// component type numaraları - discord api referansından
const ComponentType = {
    ACTION_ROW: 1,
    BUTTON: 2,
    STRING_SELECT: 3,
    TEXT_INPUT: 4,
    USER_SELECT: 5,
    ROLE_SELECT: 6,
    MENTIONABLE_SELECT: 7,
    CHANNEL_SELECT: 8,
    SECTION: 9,
    TEXT_DISPLAY: 10,
    THUMBNAIL: 11,
    MEDIA_GALLERY: 12,
    FILE: 13,
    SEPARATOR: 14,
    CONTENT_INVENTORY_ENTRY: 16,
    CONTAINER: 17
};

// buton stilleri
const ButtonStyle = {
    PRIMARY: 1,
    SECONDARY: 2,
    SUCCESS: 3,
    DANGER: 4,
    LINK: 5
};

// string -> number çevirisi için
const StyleMap = {
    'PRIMARY': 1,
    'SECONDARY': 2,
    'SUCCESS': 3,
    'DANGER': 4,
    'LINK': 5,
    'BLURPLE': 1,
    'GREY': 2,
    'GRAY': 2,
    'GREEN': 3,
    'RED': 4,
    'URL': 5
};

class PanelBuilder {
    /**
     * yeni panel builder oluştur
     * @param {import('discord.js').Client} client 
     */
    constructor(client) {
        if (!client) throw new Error('client lazım gardaş');
        this.client = client;
        this.container = null;
        this.lastMessage = null;
    }

    // container oluştur, her şey bunun içine giriyor
    createContainer() {
        this.container = {
            type: ComponentType.CONTAINER,
            components: []
        };
        return this;
    }

    // kenar çizgisi rengi, hex veya 'random' verilebilir
    setAccentColor(color) {
        if (!this.container) this.createContainer();

        if (color === 'random') {
            // rastgele renk üret
            this.container.accent_color = Math.floor(Math.random() * 0xFFFFFF);
        } else if (typeof color === 'string') {
            // hex string temizle ve çevir
            const hex = color.replace(/^#|^0x/i, '');
            if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
                throw new Error(`geçersiz renk formatı: ${color}`);
            }
            this.container.accent_color = parseInt(hex, 16);
        } else if (typeof color === 'number') {
            this.container.accent_color = color;
        } else {
            throw new Error(`renk tipi hatalı: ${typeof color}`);
        }

        return this;
    }

    // metin ekle - markdown destekler
    addTextDisplay(content) {
        if (!this.container) this.createContainer();

        this.container.components.push({
            type: ComponentType.TEXT_DISPLAY,
            content: content
        });

        return this;
    }

    // ayırıcı çizgi ekle
    addSeparator(options = {}) {
        if (!this.container) this.createContainer();

        const separator = {
            type: ComponentType.SEPARATOR,
            divider: options.divider !== false,
            spacing: options.spacing || 1 // 1=küçük, 2=büyük
        };

        this.container.components.push(separator);
        return this;
    }

    // section - metin + sağda buton veya resim olabilir
    addSection(options = {}) {
        if (!this.container) this.createContainer();

        const section = {
            type: ComponentType.SECTION,
            components: []
        };

        // metinleri ekle
        if (options.content) {
            const contents = Array.isArray(options.content) ? options.content : [options.content];
            contents.forEach(text => {
                section.components.push({
                    type: ComponentType.TEXT_DISPLAY,
                    content: text
                });
            });
        }

        // sağ tarafa buton koy
        if (options.button) {
            section.accessory = this._createButton(options.button);
        }

        // veya thumbnail koy
        if (options.thumbnail) {
            section.accessory = {
                type: ComponentType.THUMBNAIL,
                media: {
                    url: options.thumbnail.url || options.thumbnail
                }
            };
        }

        this.container.components.push(section);
        return this;
    }

    // medya galerisi - birden fazla resim yan yana
    addMediaGallery(items) {
        if (!this.container) this.createContainer();
        if (!Array.isArray(items) || items.length === 0) {
            throw new Error('en az 1 medya lazım');
        }

        const gallery = {
            type: ComponentType.MEDIA_GALLERY,
            items: items.map(item => ({
                media: {
                    url: typeof item === 'string' ? item : item.url
                },
                description: item.description || undefined
            }))
        };

        this.container.components.push(gallery);
        return this;
    }

    // buton satırı ekle - max 5 buton sığar
    addActionRow(components) {
        if (!this.container) this.createContainer();
        if (!Array.isArray(components)) {
            components = [components];
        }

        const row = {
            type: ComponentType.ACTION_ROW,
            components: components.map(comp => {
                if (comp.type === ComponentType.BUTTON || comp.style) {
                    return this._createButton(comp);
                }
                return comp;
            })
        };

        this.container.components.push(row);
        return this;
    }

    // buton objesi oluştur
    _createButton(options) {
        const button = {
            type: ComponentType.BUTTON,
            style: this._resolveStyle(options.style || 'SECONDARY'),
            label: options.label || options.text || 'Button'
        };

        // link butonunda url lazım, diğerlerinde custom_id
        if (button.style === ButtonStyle.LINK) {
            if (!options.url) throw new Error('link butonuna url ver');
            button.url = options.url;
        } else {
            button.custom_id = options.custom_id || options.customId || this._generateId();
        }

        // emoji varsa ekle
        if (options.emoji) {
            button.emoji = typeof options.emoji === 'string'
                ? { name: options.emoji }
                : options.emoji;
        }

        // disabled mı
        if (options.disabled) {
            button.disabled = true;
        }

        return button;
    }

    // select menü ekle
    addSelectMenu(options) {
        if (!this.container) this.createContainer();

        const select = {
            type: ComponentType.STRING_SELECT,
            custom_id: options.custom_id || options.customId || this._generateId(),
            options: options.options || [],
            placeholder: options.placeholder,
            min_values: options.min_values || options.minValues || 1,
            max_values: options.max_values || options.maxValues || 1,
            disabled: options.disabled || false
        };

        // select kendi action row'unda olmalı
        this.container.components.push({
            type: ComponentType.ACTION_ROW,
            components: [select]
        });

        return this;
    }

    // style string ise numaraya çevir
    _resolveStyle(style) {
        if (typeof style === 'number') return style;
        const resolved = StyleMap[style.toUpperCase()];
        if (!resolved) throw new Error(`geçersiz buton stili: ${style}`);
        return resolved;
    }

    // benzersiz id üret
    _generateId() {
        return `panel_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    }

    // json payload al
    toJSON() {
        if (!this.container) {
            throw new Error('önce createContainer() çağır');
        }

        return {
            components: [this.container],
            flags: IS_COMPONENTS_V2
        };
    }

    // kanala gönder
    async send(channel) {
        const channelId = typeof channel === 'string' ? channel : channel.id;
        const payload = this.toJSON();

        try {
            const response = await fetch(
                `https://discord.com/api/v10/channels/${channelId}/messages`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bot ${this.client.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`API hatası: ${error.message || JSON.stringify(error)}`);
            }

            this.lastMessage = await response.json();
            return this.lastMessage;
        } catch (error) {
            throw new Error(`panel gönderilemedi: ${error.message}`);
        }
    }

    // mesajı düzenle
    async edit(message) {
        const msg = message || this.lastMessage;
        if (!msg) throw new Error('düzenlenecek mesaj yok');

        const messageId = typeof msg === 'string' ? msg : msg.id;
        const channelId = typeof msg === 'string' ? this.lastMessage?.channel_id : msg.channel_id;

        if (!channelId) throw new Error('kanal id bulunamadı');

        const payload = this.toJSON();

        try {
            const response = await fetch(
                `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bot ${this.client.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`API hatası: ${error.message || JSON.stringify(error)}`);
            }

            this.lastMessage = await response.json();
            return this.lastMessage;
        } catch (error) {
            throw new Error(`panel düzenlenemedi: ${error.message}`);
        }
    }

    // mesaja cevap ver
    async reply(message, options = {}) {
        const channelId = message.channel?.id || message.channelId || message.channel_id;
        const messageId = message.id;

        if (!channelId || !messageId) {
            throw new Error('geçersiz mesaj objesi');
        }

        const payload = {
            ...this.toJSON(),
            message_reference: {
                message_id: messageId
            },
            allowed_mentions: {
                replied_user: options.mention || false
            }
        };

        try {
            const response = await fetch(
                `https://discord.com/api/v10/channels/${channelId}/messages`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bot ${this.client.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`API hatası: ${error.message || JSON.stringify(error)}`);
            }

            this.lastMessage = await response.json();
            return this.lastMessage;
        } catch (error) {
            throw new Error(`cevap gönderilemedi: ${error.message}`);
        }
    }

    // interaction'a cevap ver - slash command veya buton için
    async replyInteraction(interaction, options = {}) {
        const payload = this.toJSON();

        // ephemeral mi
        if (options.ephemeral) {
            payload.flags = (payload.flags || 0) | 64;
        }

        try {
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply(payload);
            } else {
                await interaction.reply(payload);
            }
        } catch (error) {
            throw new Error(`interaction cevabı gönderilemedi: ${error.message}`);
        }
    }
}

module.exports = PanelBuilder;
module.exports.ComponentType = ComponentType;
module.exports.ButtonStyle = ButtonStyle;
module.exports.IS_COMPONENTS_V2 = IS_COMPONENTS_V2;
