//=============================================================================
// 車輛搖晃 JS 模組：最小範例描畫腳本 / 車両動揺JSモジュール：最小サンプル描画スクリプト / Body-motion module: minimal example render script
//=============================================================================
// 使用方式：把此檔複製到列車包的 assets/minecraft/scripts/，改名後在車輛 JSON 的 rendererPath 指定它，
// 再把 init() 裡的零件名稱改成你的模型物件名稱。 /
// 使い方：このファイルを車両パックの assets/minecraft/scripts/ にコピーして改名し、車両JSONのrendererPathに指定します。
// その後、init()内の部品名をモデルのオブジェクト名に変更してください。 /
// Usage: copy this file into your pack's assets/minecraft/scripts/, rename it, point rendererPath in the vehicle JSON at it,
// then change the part names in init() to your model's object names.
// 使用本模組時，請在列車的 readme 標明「使用了 C-TREC & 月島重工 製作的晃動 JS」（見 ライセンス_License.txt）。 /
// 本モジュールを使用する場合は、車両のreadmeに「C-TREC & 月島重工 制作の動揺JSを使用」と明記してください（ライセンス_License.txt参照）。 /
// When using this module, state in your vehicle's readme that it uses the body-motion JS made by C-TREC & 月島重工 (see ライセンス_License.txt).

var renderClass = "jp.ngt.rtm.render.VehiclePartsRenderer";
importPackage(Packages.org.lwjgl.opengl);
importPackage(Packages.jp.ngt.rtm.render);

//-----------------------------------------------------------------------------
// 調校（選填）：只寫要改的項目，其餘使用模組預設值；整段刪除則全部使用預設值。
// 調整（任意）：変更する項目だけ書き、残りはモジュールの既定値を使います。丸ごと削除するとすべて既定値になります。
// Tuning (optional): write only what you change; everything else uses the module defaults. Delete the whole block to use all defaults.
// 全部參數與說明見同資料夾的 全パラメータ参考_MOTION_TUNING_FullReference.js（即模組預設值）。 / 全パラメータと説明は同じフォルダの全パラメータ参考_MOTION_TUNING_FullReference.js（モジュールの既定値）を参照。 / See 全パラメータ参考_MOTION_TUNING_FullReference.js in this folder for every parameter (the module defaults).
//-----------------------------------------------------------------------------
var MOTION_TUNING = {
	straight: { defaultScale: 0.70 },   // 直線晃動倍率 / 直線動揺の倍率 / Straight-track motion scale.
	load: { rollPerPersonDeg: 0.15 }    // 每位乘客造成的傾斜 / 乗客1人あたりの傾斜 / Tilt per passenger.
};

// 載入車輛搖晃模組（平台適配器與所需的 Java 套件會自動載入）。 / 車両動揺モジュールを読み込みます（アダプターと必要なJavaパッケージは自動で読込）。 / Load the body-motion module (the adapter and required Java packages are loaded automatically).
//include <scripts/RTMBodyMotion.js>

function init(par1, par2) {
	// 改成你的模型物件名稱 / モデルのオブジェクト名に変更 / Change to your model's object names.
	body = renderer.registerParts(new Parts("body", "interior"));
	glass = renderer.registerParts(new Parts("glass"));
	lights = renderer.registerParts(new Parts("light"));
}

function render(entity, pass, par3) {
	GL11.glPushMatrix();
	// 車體晃動：之後描畫的零件都會一起晃；轉向架由 RTM 另外描畫，不受影響。 /
	// 車体動揺：この後に描画する部品はすべて一緒に揺れます。台車はRTMが別に描画するため影響しません。 /
	// Body motion: everything rendered after this moves with the body; bogies are rendered separately by RTM and are unaffected.
	RTMBodyMotion.applyPose(entity, par3);

	if (pass == 0) {                       // 一般 / 通常 / Normal
		body.render(renderer);
	}
	if (pass == 1) {                       // 半透明 / 半透明 / Translucent
		glass.render(renderer);
	}
	if (pass > 1) {                        // 發光 / 発光 / Emissive
		var emissive = RTMBodyMotion.beginEmissivePass();
		try {
			lights.render(renderer);
		} finally {
			RTMBodyMotion.endEmissivePass(emissive);
		}
	}

	GL11.glPopMatrix();
	// 不想跟著晃的零件請在 glPopMatrix() 之後描畫。 / 揺らしたくない部品はglPopMatrix()の後に描画します。 / Render parts that should not move after glPopMatrix().
}
