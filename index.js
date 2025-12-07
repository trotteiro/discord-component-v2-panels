/*
 * Discord Component V2 Panel Bot
 * örnek paneller için demo bot
 */

require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');
const PanelBuilder = require('./src/structures/PanelBuilder');

// client oluştur
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// bot açıldı
client.once(Events.ClientReady, (c) => {
    console.log(`✅ ${c.user.tag} aktif`);
    console.log(`📌 Prefix: !`);
    console.log(`📋 Komutlar: !panel, !panelbuton, !panelmedia, !panelsection, !panelselect`);
});

// mesaj gelince
client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    const prefix = '!';
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    try {
        // basit panel
        if (command === 'panel') {
            const panel = new PanelBuilder(client)
                .createContainer()
                .setAccentColor('#5865F2')
                .addTextDisplay(`# 🎉 Hoş Geldiniz!`)
                .addTextDisplay(`**${message.guild.name}** sunucusuna hoş geldiniz.`)
                .addSeparator()
                .addTextDisplay(`-# Component V2 ile yapıldı`)
                .addTextDisplay(`-# Tarih: ${new Date().toLocaleDateString('tr-TR')}`);

            await panel.send(message.channel);
            console.log(`[PANEL] ${message.author.tag} panel gönderdi`);
        }

        // butonlu panel
        else if (command === 'panelbuton') {
            const panel = new PanelBuilder(client)
                .createContainer()
                .setAccentColor('#57F287')
                .addTextDisplay(`# ⚙️ Ayarlar Paneli`)
                .addTextDisplay(`Butonlarla ayarları değiştir.`)
                .addSeparator({ spacing: 1 })
                .addActionRow([
                    {
                        style: 'PRIMARY',
                        label: '🔔 Bildirimler',
                        custom_id: 'notifications'
                    },
                    {
                        style: 'SECONDARY',
                        label: '🎨 Tema',
                        custom_id: 'theme'
                    },
                    {
                        style: 'SUCCESS',
                        label: '✅ Kaydet',
                        custom_id: 'save'
                    },
                    {
                        style: 'DANGER',
                        label: '🗑️ Sıfırla',
                        custom_id: 'reset'
                    }
                ])
                .addActionRow([
                    {
                        style: 'LINK',
                        label: '📖 Dökümantasyon',
                        url: 'https://discord.com/developers/docs'
                    }
                ]);

            await panel.send(message.channel);
            console.log(`[PANEL] ${message.author.tag} butonlu panel gönderdi`);
        }

        // medya galerisi
        else if (command === 'panelmedia') {
            const panel = new PanelBuilder(client)
                .createContainer()
                .setAccentColor('#EB459E')
                .addTextDisplay(`# 🖼️ Galeri`)
                .addTextDisplay(`Örnek görseller:`)
                .addSeparator()
                .addMediaGallery([
                    {
                        url: 'https://cdn.discordapp.com/embed/avatars/0.png',
                        description: 'Avatar 1'
                    },
                    {
                        url: 'https://cdn.discordapp.com/embed/avatars/1.png',
                        description: 'Avatar 2'
                    },
                    {
                        url: 'https://cdn.discordapp.com/embed/avatars/2.png',
                        description: 'Avatar 3'
                    }
                ])
                .addSeparator()
                .addTextDisplay(`-# 3 görsel`);

            await panel.send(message.channel);
            console.log(`[PANEL] ${message.author.tag} medya paneli gönderdi`);
        }

        // section + thumbnail
        else if (command === 'panelsection') {
            const panel = new PanelBuilder(client)
                .createContainer()
                .setAccentColor('#FEE75C')
                .addTextDisplay(`# 👤 Profil`)
                .addSeparator()
                .addSection({
                    content: [
                        `**${message.author.username}**`,
                        `-# ID: ${message.author.id}`,
                        `-# Katılım: ${message.member?.joinedAt?.toLocaleDateString('tr-TR') || 'Bilinmiyor'}`
                    ],
                    thumbnail: message.author.displayAvatarURL({ extension: 'png', size: 256 })
                })
                .addSeparator()
                .addSection({
                    content: [
                        `**${message.guild.name}**`,
                        `-# ${message.guild.memberCount} üye`
                    ],
                    button: {
                        style: 'PRIMARY',
                        label: 'Detay',
                        custom_id: 'user_details'
                    }
                });

            await panel.send(message.channel);
            console.log(`[PANEL] ${message.author.tag} section paneli gönderdi`);
        }

        // select menü
        else if (command === 'panelselect') {
            const panel = new PanelBuilder(client)
                .createContainer()
                .setAccentColor('#ED4245')
                .addTextDisplay(`# 🎮 Rol Seç`)
                .addTextDisplay(`Menüden rol seç:`)
                .addSeparator()
                .addSelectMenu({
                    custom_id: 'role_select',
                    placeholder: '🎯 Rol seçin...',
                    options: [
                        {
                            label: '🎮 Oyuncu',
                            value: 'gamer',
                            description: 'Oyuncular için'
                        },
                        {
                            label: '🎵 Müzisyen',
                            value: 'musician',
                            description: 'Müzik sevenler'
                        },
                        {
                            label: '🎨 Sanatçı',
                            value: 'artist',
                            description: 'Yaratıcılar'
                        },
                        {
                            label: '💻 Developer',
                            value: 'developer',
                            description: 'Yazılımcılar'
                        }
                    ]
                })
                .addSeparator()
                .addTextDisplay(`-# Seçim kaydedilecek`);

            await panel.send(message.channel);
            console.log(`[PANEL] ${message.author.tag} select paneli gönderdi`);
        }

        // random renk
        else if (command === 'panelrandom') {
            const panel = new PanelBuilder(client)
                .createContainer()
                .setAccentColor('random')
                .addTextDisplay(`# 🎲 Rastgele`)
                .addTextDisplay(`Renk random!`)
                .addSeparator()
                .addTextDisplay(`-# Her seferinde farklı`)
                .addActionRow([
                    {
                        style: 'PRIMARY',
                        label: '🔄 Yenile',
                        custom_id: 'refresh_random'
                    }
                ]);

            await panel.send(message.channel);
            console.log(`[PANEL] ${message.author.tag} random panel gönderdi`);
        }

    } catch (error) {
        console.error(`[HATA] ${error.message}`);

        try {
            await message.reply({
                content: `❌ Hata: ${error.message}`,
                allowedMentions: { repliedUser: false }
            });
        } catch (e) {
            console.error(`[HATA] mesaj gönderilemedi`);
        }
    }
});

// buton/select tıklamaları
client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isButton()) {
        console.log(`[BUTON] ${interaction.user.tag} -> ${interaction.customId}`);

        const responsePanel = new PanelBuilder(client)
            .createContainer()
            .setAccentColor('#5865F2')
            .addTextDisplay(`✅ **${interaction.customId}** tıklandı!`)
            .addTextDisplay(`-# Bu örnek bir yanıt`);

        await responsePanel.replyInteraction(interaction, { ephemeral: true });
    }

    if (interaction.isStringSelectMenu()) {
        console.log(`[SELECT] ${interaction.user.tag} -> ${interaction.values.join(', ')}`);

        const responsePanel = new PanelBuilder(client)
            .createContainer()
            .setAccentColor('#57F287')
            .addTextDisplay(`✅ Seçim: **${interaction.values.join(', ')}**`)
            .addTextDisplay(`-# Kaydedildi`);

        await responsePanel.replyInteraction(interaction, { ephemeral: true });
    }
});

// login
client.login(process.env.BOT_TOKEN);
