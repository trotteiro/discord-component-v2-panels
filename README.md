<div align="center">

# 🎨 Discord Component V2 Panel Builder

**Modern panel mesajları oluşturmak için discord.js v14 kütüphanesi**

[![Discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org)
[![Node.js](https://img.shields.io/badge/node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)

---


**Made by [Trotteiro](https://github.com/Trotteiro)**

</div>

---

## ⚙️ Kurulum

```bash
git clone https://github.com/Trotteiro/discord-component-v2-panels.git
cd discord-component-v2-panels
npm install
```

## ⚙️ Yapılandırma

`.env` dosyası oluştur:

```env
BOT_TOKEN=your_bot_token_here
```

## 🚀 Başlatma

```bash
npm start
```

---

## 📋 Komutlar

| Komut | Açıklama |
|:------|:---------|
| `!panel` | Basit panel |
| `!panelbuton` | Butonlu panel |
| `!panelmedia` | Medya galerisi |
| `!panelsection` | Section + Thumbnail |
| `!panelselect` | Select menü |
| `!panelrandom` | Rastgele renk |

---

## � Kullanım

```javascript
const PanelBuilder = require('./src/structures/PanelBuilder');

const panel = new PanelBuilder(client)
    .createContainer()
    .setAccentColor('#5865F2')
    .addTextDisplay('# Başlık')
    .addTextDisplay('İçerik')
    .addSeparator()
    .addActionRow([
        { style: 'PRIMARY', label: 'Tıkla', custom_id: 'btn' }
    ]);

await panel.send(channel);
```

---

## 🎨 Özellikler

<div align="center">

| Özellik | Açıklama |
|:--------|:---------|
| 📦 Container | Ana kapsayıcı bileşen |
| 📝 Text Display | Markdown destekli metin |
| 🖼️ Media Gallery | Çoklu resim galerisi |
| 📂 Section | Thumbnail + accessory |
| 🔘 Button | Tıklanabilir butonlar |
| 📋 Select Menu | Açılır seçim menüsü |
| ➖ Separator | Ayırıcı çizgi |

</div>

---

## � Renk Seçenekleri

```javascript
.setAccentColor('#5865F2')     // hex string
.setAccentColor('5865F2')      // # olmadan
.setAccentColor(0x5865F2)      // number
.setAccentColor('random')      // rastgele
```

---

## 📡 Metodlar

```javascript
await panel.send(channel);                           // kanala gönder
await panel.reply(message, { mention: false });      // mesaja cevap
await panel.edit(sentMessage);                       // düzenle
await panel.replyInteraction(interaction);           // interaction yanıtı
```

---

<div align="center">

## ⚙️ Component Types

| Type | Code | Description |
|:-----|:----:|:------------|
| Container | `17` | Root component |
| Text Display | `10` | Text content |
| Section | `9` | Section with accessory |
| Separator | `14` | Divider line |
| Media Gallery | `12` | Image gallery |
| Action Row | `1` | Button/Select row |
| Button | `2` | Clickable button |
| String Select | `3` | Dropdown menu |

---

### ⭐ Star this repo if you like it!

**[Trotteiro](https://github.com/Trotteiro)** © 2025

</div>
