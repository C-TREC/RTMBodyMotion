# RTMBodyMotion — RTM 車輛搖晃 JS 模組 v1.0

製作：**C-TREC & 月島重工**

讓 RealTrainMod 列車的車體在描畫時產生懸吊晃動：彎道外傾與回彈、直線軌道不整晃動、道岔衝擊、急制動與停車衝動、乘客上下車與走動造成的載重傾斜。只改變車體的視覺描畫，不影響列車實體、碰撞箱、座位、轉向架或玩家視角。

支援 1.7.10（KaizPatchX）、1.12.2（RTM 2.4.x）、RTMU 1.21.1（NeoForge／Fabric）。

## 檔案

| 檔案 | 內容 |
|---|---|
| `scripts/RTMBodyMotion.js` | 晃動模組本體 |
| `scripts/RTMBodyMotionAdapter.js` | 平台適配器（吸收三個版本的 API 差異，由模組自動載入） |
| `examples/Render_script_example.js` | 描畫腳本範例：完整的 `MOTION_TUNING` 與套用方式 |
| `導入説明_InstallationGuide.txt` | 安裝與調校說明（中／日／英） |
| `LICENSE.txt` | 授權條款（中／日／英） |

## 快速開始

1. 把 `scripts/` 的兩個檔案複製到列車包的 `assets/minecraft/scripts/`。
2. 在描畫腳本載入模組，並在 `render()` 裡呼叫 `RTMBodyMotion.applyPose(entity, par3)`（見 `examples/`）。
3. 要調整效果時定義 `MOTION_TUNING`，只寫要改的項目。

詳細步驟見 `導入説明_InstallationGuide.txt`。

## 授權

可自由使用、修改與再發布（包含放入自己的列車包）。使用本模組（含修改版）的列車，須在該列車的 readme 標明：

> 車體晃動：使用了 C-TREC & 月島重工 製作的晃動 JS（RTMBodyMotion v1.0）

全文見 [`LICENSE.txt`](LICENSE.txt)。

---

## 日本語

RTM車両の車体描画にサスペンションの揺れを加えるJSモジュールです（曲線の外傾と揺り戻し、直線の軌道狂い、分岐器の衝撃、急制動・停止衝動、乗降や車内移動による荷重傾斜）。1.7.10（KaizPatchX）・1.12.2（RTM 2.4.x）・RTMU 1.21.1 対応。導入方法は `導入説明_InstallationGuide.txt` を参照してください。
自由に使用・改変・再配布できます。使用する車両はreadmeに「C-TREC & 月島重工 制作の動揺JSを使用」と明記してください。

## English

A JS module that adds suspension motion to how RealTrainMod train bodies are rendered (curve lean and rebound, straight-track irregularity, turnout impacts, emergency-brake and stop shock, passenger-load tilt). Supports 1.7.10 (KaizPatchX), 1.12.2 (RTM 2.4.x) and RTMU 1.21.1. See `導入説明_InstallationGuide.txt` for installation.
Free to use, modify and redistribute; any vehicle using it must credit "the body-motion JS made by C-TREC & 月島重工" in its readme.
