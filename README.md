# RTMBodyMotion v1.0

![Minecraft](https://img.shields.io/badge/Minecraft-1.12.2-44cc11) ![Forge](https://img.shields.io/badge/Forge-1.12.2--14.23.5.2855-e0712b) ![RealTrainMod](https://img.shields.io/badge/RealTrainMod-2.4.24-007ec6)<br>
![Minecraft](https://img.shields.io/badge/Minecraft-1.7.10-44cc11) ![Forge](https://img.shields.io/badge/Forge-1.7.10-e0712b) ![RealTrainMod](https://img.shields.io/badge/RealTrainMod-KaizPatchX-007ec6)<br>
![Minecraft](https://img.shields.io/badge/Minecraft-1.21.1-44cc11) ![Loader](https://img.shields.io/badge/NeoForge%20%2F%20Fabric-1.21.1-e0712b) ![RTMU](https://img.shields.io/badge/RTMU-1.0.19-007ec6)

RTM 車輛搖晃 JS 模組 / RTM車両動揺JSモジュール / Vehicle body-motion JS module for RealTrainMod

製作 / 制作 / Made by：**C-TREC & 月島重工**

[中文](#中文) · [日本語](#日本語) · [English](#english)

---

## 中文

讓 RealTrainMod 列車的車體在描畫時產生懸吊晃動：彎道外傾與回彈、直線軌道不整晃動、道岔衝擊、急制動與停車衝動、乘客上下車與走動造成的載重傾斜。只改變車體的視覺描畫，不影響列車實體、碰撞箱、座位、轉向架或玩家視角。

### 支援版本

| Minecraft | 模組載入器 | RTM |
|---|---|---|
| 1.12.2 | Forge 1.12.2-14.23.5.2855 | RealTrainMod 2.4.24 |
| 1.7.10 | Forge 1.7.10 | RealTrainMod KaizPatchX |
| 1.21.1 | NeoForge／Fabric | RTMU 1.0.19 |

版本差異由 `RTMBodyMotionAdapter.js` 自動判斷處理。RTMU 1.21.1 已依 v1.0.19 原始碼對照 API，尚未在遊戲內實車驗證；更舊的 RTMU（例如 1.0.4）沒有實體查詢 API，乘客載重效果會自動停用，其他晃動不受影響。

### 檔案

| 檔案 | 內容 |
|---|---|
| `scripts/RTMBodyMotion.js` | 晃動模組本體 |
| `scripts/RTMBodyMotionAdapter.js` | 平台適配器（由模組自動載入） |
| `examples/Render_script_example.js` | 描畫腳本範例：完整的 `MOTION_TUNING` 與套用方式 |
| `導入説明_InstallationGuide.txt` | 安裝與調校說明（中／日／英） |
| `LICENSE.txt` | 授權條款（中／日／英） |

### 快速開始

1. 把 `scripts/` 的兩個檔案複製到列車包的 `assets/minecraft/scripts/`。
2. 在描畫腳本載入模組，並在 `render()` 裡呼叫 `RTMBodyMotion.applyPose(entity, par3)`（見 `examples/`）。
3. 要調整效果時定義 `MOTION_TUNING`，只寫要改的項目；未寫的項目使用預設值。

詳細步驟見 `導入説明_InstallationGuide.txt`。

### 授權

可自由使用、修改與再發布（包含放入自己的列車包）。使用本模組（含修改版）的列車，須在該列車的 readme 標明：

> 車體晃動：使用了 C-TREC & 月島重工 製作的晃動 JS（RTMBodyMotion v1.0）

全文見 [`LICENSE.txt`](LICENSE.txt)。

---

## 日本語

RealTrainModの車両の車体描画にサスペンションの揺れを加えます。曲線での外傾と揺り戻し、直線の軌道狂いによる揺れ、分岐器の衝撃、急制動・停止時の衝動、乗客の乗降や車内移動による荷重傾斜に対応します。車体の見た目だけを変え、車両エンティティ・当たり判定・座席・台車・プレイヤー視点には影響しません。

### 対応バージョン

| Minecraft | MODローダー | RTM |
|---|---|---|
| 1.12.2 | Forge 1.12.2-14.23.5.2855 | RealTrainMod 2.4.24 |
| 1.7.10 | Forge 1.7.10 | RealTrainMod KaizPatchX |
| 1.21.1 | NeoForge／Fabric | RTMU 1.0.19 |

バージョン差は `RTMBodyMotionAdapter.js` が自動で判別して吸収します。RTMU 1.21.1 は v1.0.19 のソースコードでAPIを照合済みですが、ゲーム内での実車検証はまだです。古いRTMU（1.0.4など）はエンティティ取得APIがないため乗客荷重効果のみ自動で無効になり、他の揺れには影響しません。

### ファイル

| ファイル | 内容 |
|---|---|
| `scripts/RTMBodyMotion.js` | 動揺モジュール本体 |
| `scripts/RTMBodyMotionAdapter.js` | プラットフォームアダプター（モジュールが自動で読み込み） |
| `examples/Render_script_example.js` | 描画スクリプト例：全項目の `MOTION_TUNING` と適用方法 |
| `導入説明_InstallationGuide.txt` | 導入・調整説明（中／日／英） |
| `LICENSE.txt` | ライセンス（中／日／英） |

### クイックスタート

1. `scripts/` の2ファイルを車両パックの `assets/minecraft/scripts/` にコピーします。
2. 描画スクリプトでモジュールを読み込み、`render()` 内で `RTMBodyMotion.applyPose(entity, par3)` を呼びます（`examples/` 参照）。
3. 調整する場合は `MOTION_TUNING` を定義し、変更する項目だけ書きます。書かない項目は既定値を使います。

詳しくは `導入説明_InstallationGuide.txt` を参照してください。

### ライセンス

自由に使用・改変・再配布できます（自作の車両パックへの同梱を含む）。本モジュール（改変版を含む）を使用する車両は、readmeに次のように明記してください。

> 車体動揺：C-TREC & 月島重工 制作の動揺JS（RTMBodyMotion v1.0）を使用

全文は [`LICENSE.txt`](LICENSE.txt) を参照してください。

---

## English

Adds suspension motion to how RealTrainMod train bodies are rendered: outward lean and rebound in curves, random motion from track irregularity on straight track, turnout impacts, emergency-braking and stop shock, and load tilt when passengers board, alight or walk around. Only the body's appearance changes; the train entity, collision box, seats, bogies and the player's view are not affected.

### Supported versions

| Minecraft | Mod loader | RTM |
|---|---|---|
| 1.12.2 | Forge 1.12.2-14.23.5.2855 | RealTrainMod 2.4.24 |
| 1.7.10 | Forge 1.7.10 | RealTrainMod KaizPatchX |
| 1.21.1 | NeoForge / Fabric | RTMU 1.0.19 |

`RTMBodyMotionAdapter.js` detects the platform and absorbs the differences automatically. RTMU 1.21.1 support was checked against the v1.0.19 source code but has not yet been verified in game. Older RTMU builds (e.g. 1.0.4) lack the entity-query API, so only the passenger-load effect is disabled there; all other motion still works.

### Files

| File | Contents |
|---|---|
| `scripts/RTMBodyMotion.js` | The body-motion module |
| `scripts/RTMBodyMotionAdapter.js` | Platform adapter (loaded automatically by the module) |
| `examples/Render_script_example.js` | Render-script example: full `MOTION_TUNING` and how to apply the pose |
| `導入説明_InstallationGuide.txt` | Installation and tuning guide (Chinese / Japanese / English) |
| `LICENSE.txt` | License (Chinese / Japanese / English) |

### Quick start

1. Copy the two files in `scripts/` into your vehicle pack's `assets/minecraft/scripts/`.
2. Load the module in your render script and call `RTMBodyMotion.applyPose(entity, par3)` inside `render()` (see `examples/`).
3. To tune the effect, define `MOTION_TUNING` with only the entries you change; everything else uses the defaults.

See `導入説明_InstallationGuide.txt` for details.

### License

Free to use, modify and redistribute, including bundling with your own vehicle pack. Any vehicle that uses this module (including modified versions) must state in its readme:

> Body motion: uses the body-motion JS (RTMBodyMotion v1.0) made by C-TREC & 月島重工

See [`LICENSE.txt`](LICENSE.txt) for the full text.
