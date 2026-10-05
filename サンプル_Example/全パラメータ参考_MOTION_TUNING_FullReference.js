//=============================================================================
// 全部參數參考（模組預設值） / 全パラメータ参考（モジュール既定値） / FULL PARAMETER REFERENCE (module defaults)
//=============================================================================
// 此檔列出 RTMBodyMotion.js 的所有調校參數，數值即模組預設值（與 RTMBodyMotion.js 開頭的 MOTION_DEFAULT_TUNING 相同）。 /
// このファイルはRTMBodyMotion.jsの全調整パラメータを示し、値はモジュールの既定値です（RTMBodyMotion.js冒頭のMOTION_DEFAULT_TUNINGと同じ）。 /
// This file lists every tuning parameter of RTMBodyMotion.js; the values are the module defaults (identical to MOTION_DEFAULT_TUNING at the top of RTMBodyMotion.js).
// 用法：把需要修改的部分複製到描畫腳本的 MOTION_TUNING；沒寫的項目會自動使用相同的預設值。整段貼上也可以。此檔僅供參考，不需放進列車包。 /
// 使い方：変更したい部分を描画スクリプトのMOTION_TUNINGにコピーします。書かない項目は同じ既定値が自動で使われます。丸ごと貼り付けても構いません。このファイルは参考用で、車両パックに入れる必要はありません。 /
// Usage: copy the parts you want to change into the render script's MOTION_TUNING; omitted entries automatically use the same defaults. Pasting the whole block also works. Reference only; it does not need to go into your pack.
// 單位：角度=deg、位移=m、頻率=Hz、速度=km/h 或 m/s。 / 単位：角度=deg、変位=m、周波数=Hz、速度=km/h または m/s。 / Units: angle=deg, offset=m, frequency=Hz, speed=km/h or m/s.
// 阻尼越小，回彈越久；頻率越小，動作越柔慢。 / 減衰が小さいほど長く揺れ、周波数が小さいほど柔らかく遅くなります。 / Lower damping gives a longer tail; lower frequency gives a slower, softer response.
var MOTION_TUNING = {
	//----------------------------------------------------------------------
	// 彎道晃動與車體懸吊 / 曲線動揺と車体サスペンション / CURVE MOTION AND BODY SUSPENSION
	// 車體固有頻率與阻尼（彎道、道岔、直線晃動共用），以及超高不足造成的持續外傾與進出彎衝擊。 / 車体固有周波数と減衰（曲線・分岐器・直線で共用）、カント不足による持続外傾と進入退出の衝撃。 / Body natural frequency and damping (shared by curve, turnout and straight motion), plus sustained lean and entry/exit jolts from cant deficiency.
	//----------------------------------------------------------------------
	curve: {
		amplitudeScale: 1.00,      // 彎道整體幅度倍率；峰值已直接由 peakRollDeg／peakSwayM 指定 / 曲線全体振幅倍率；ピーク値はpeakRollDeg／peakSwayMで直接指定 / Overall curve-amplitude scale; peaks are set directly by peakRollDeg/peakSwayM.
		sluggishnessScale: 1.00,   // 車體反應與拖尾時間倍率；只改變時間，不改變幅度 / 車体応答と余韻の時間倍率；時間のみ変え振幅は不変 / Body response and tail-time scale; changes timing only, not amplitude.
		maxRollDeg: 3.00,          // 所有通道合成後的最大左右傾角 / 全チャンネル合成後の最大ロール角 / Maximum combined roll angle.
		maxSwayM: 0.085,           // 所有通道合成後的最大橫向位移 / 全チャンネル合成後の最大横変位 / Maximum combined lateral offset.
		leanRollDeg: 1.20,         // 彎道中持續的外傾角（超高不足飽和時）；進彎過衝、出彎反彈由彈簧自然產生；0=舊版不持續側傾 / 曲線中の持続外傾角（カント不足飽和時）；進入時の行き過ぎと退出時の戻りはばねが自然に生成；0=旧版の持続傾斜なし / Sustained outward lean in curves at saturated cant deficiency; entry overshoot and exit rebound come from the spring; 0 restores the old no-lean behavior.
		leanSwayM: 0.030,          // 彎道中持續的外側橫移（超高不足飽和時） / 曲線中の持続外側横変位（カント不足飽和時） / Sustained outward sway in curves at saturated cant deficiency.
		peakRollDeg: 0.40,         // 進彎時額外的衝擊峰值（疊加在持續外傾上） / 曲線進入時の追加衝撃ピーク（持続外傾に重畳） / Extra curve-entry jolt peak, added on top of the sustained lean.
		peakSwayM: 0.012,          // 進彎時額外的橫移衝擊峰值 / 曲線進入時の追加横変位衝撃ピーク / Extra curve-entry sway jolt peak.
		saturationMm: 50.0,        // 超高不足飽和基準；約此值時達峰值的76% / カント不足飽和基準；この値でピークの約76% / Cant-deficiency saturation reference; reaches about 76% of peak here.
		rollFrequencyHz: 0.75,     // 車體橫搖固有頻率；越小越柔 / 車体ロール固有周波数；小さいほど柔らかい / Body roll natural frequency; lower is softer.
		rollDamping: 0.10,         // 車體橫搖阻尼比；越小回彈次數越多、餘韻越長 / 車体ロール減衰比；小さいほど揺り返しが多く余韻が長い / Body roll damping ratio; lower gives more rebounds and a longer tail.
		swayFrequencyHz: 0.85,     // 車體橫移固有頻率 / 車体横変位固有周波数 / Body lateral-sway natural frequency.
		swayDamping: 0.10,         // 車體橫移阻尼比 / 車体横変位減衰比 / Body lateral-sway damping ratio.
		inputFilterHz: 1.6,        // 超高不足輸入濾波；越大反應越快但越易受 Yaw 雜訊影響 / カント不足入力フィルタ；大きいほど速いがYawノイズに敏感 / Cant-deficiency input filter; higher is quicker but more sensitive to yaw noise.
		minSpeedMps: 4.0,          // 開始判定超高不足的最低速度 / カント不足判定の最低速度 / Minimum speed for cant-deficiency motion.
		minCantDeficiencyMm: 5.0,  // 啟動晃動的最低超高不足 / 動揺開始の最小カント不足 / Minimum cant deficiency that can trigger motion.
		exitResponseFactor: 0.62,  // 出彎反向回應倍率 / 曲線退出時の逆応答倍率 / Reverse response multiplier on curve exit.
		reverseExitFactor: 0.00,   // 反向彎（S 形）時前彎的額外出彎衝量倍率；持續外傾翻轉已提供反向甩動，預設不再疊加 / 反向曲線（S字）時の前曲線追加退出衝撃倍率；持続外傾の反転で逆振りが出るため既定では重ねない / Extra exit-impulse multiplier on an S-curve reversal; the lean flip already swings the body, so none is added by default.
		stageThreshold: 0.018,     // 不同曲率階段成立門檻 / 曲率段階差の成立しきい値 / Sustained curvature-stage threshold.
		stageHoldTicks: 2,         // 曲率差需持續的 Tick / 曲率差の必要継続Tick / Ticks a curvature change must persist.
		exitHoldTicks: 6           // 確認離開整體彎道的 Tick；反向彎（S 形）不必等待 / 曲線退出確認Tick；反向曲線（S字）は待たない / Ticks required to confirm curve exit; reverse (S) curves do not wait.
	},
	//----------------------------------------------------------------------
	// 直線晃動 / 直線動揺 / STRAIGHT-TRACK MOTION
	// 模擬軌道不整的隨機晃動；倍率可用 DataMap 增減。 / 軌道狂いを模したランダム動揺；倍率はDataMapで増減できます。 / Random motion imitating track irregularity; the scale can be adjusted via DataMap.
	//----------------------------------------------------------------------
	straight: {
		defaultScale: 0.70,      // 直線晃動預設倍率；0=關閉 / 直線動揺の既定倍率；0=無効 / Default straight-track motion scale; 0 disables it.
		dataMapKey: "BodyMotionStraightAdjust", // DataMap 增減量（double）；最終倍率=defaultScale+此值 / DataMap増減量（double）；最終倍率=defaultScale+この値 / DataMap adjustment (double); final scale = defaultScale + this value.
		maxScale: 4.00,          // 最終倍率上限 / 最終倍率上限 / Upper bound of the final scale.
		// 以隨機激振驅動車體彈簧，輸出落在固有頻率且幅度自然起伏；以下為倍率1.0、高速時的標準差。 / ランダム加振で車体ばねを駆動し、固有周波数で振幅が自然に揺らぎます。以下は倍率1.0・高速時の標準偏差です。 / Random excitation drives the body springs so motion sits at the natural frequency with a varying envelope; values are standard deviations at scale 1.0 and full speed.
		rollStdDeg: 0.12,        // 直線橫搖標準差；參考影片實測約 0.12° / 直線ロール標準偏差；参考動画の実測約0.12° / Straight roll standard deviation; reference video measures about 0.12°.
		swayStdM: 0.004,         // 直線橫移標準差 / 直線横変位標準偏差 / Straight sway standard deviation.
		bounceStdM: 0.0015,      // 直線上下標準差 / 直線上下動標準偏差 / Straight bounce standard deviation.
		minSpeedKmh: 3.0,        // 低於此速度不晃動 / この速度未満は動揺なし / No motion below this speed.
		referenceSpeedKmh: 50.0  // 幅度隨速度成長的基準；此速度約達63% / 速度による振幅成長の基準；この速度で約63% / Speed reference for amplitude growth; about 63% at this speed.
	},
	//----------------------------------------------------------------------
	// 道岔衝擊 / 分岐器衝撃 / TURNOUT IMPACTS
	// 通過尖軌與轍叉時的衝擊。 / トングレールとクロッシング通過時の衝撃。 / Impacts when passing the switch toe and frog crossing.
	//----------------------------------------------------------------------
	turnout: {
		// 道岔衝擊直接激起車體本身的橫搖／橫移擺動（與彎道同一模式）。 / 分岐器衝撃は車体自身のロール・横変位振動（曲線と同じモード）を励起します。 / Turnout impacts excite the body's own roll/sway mode, the same one used by curves.
		minSpeedFactor: 0.45,      // 高速時仍保留的最小晃動比例 / 高速時にも残す最小動揺率 / Minimum turnout motion retained at high speed.
		speedFalloffKmh: 60.0,     // 速度衰減基準；越大則高速衰減越慢 / 速度減衰基準；大きいほど高速でも強い / Speed falloff reference; higher retains more effect at speed.
		toePeakRollDeg: 0.20,      // 尖軌橫搖峰值 / トングレールのロールピーク / Switch-toe roll peak.
		toePeakSwayM: 0.005,       // 尖軌橫移峰值 / トングレールの横変位ピーク / Switch-toe sway peak.
		toeBounceImpulse: 0.038,   // 尖軌上下震動 / トングレールの上下動 / Switch-toe vertical impulse.
		frogPeakRollDeg: 0.60,     // 轍叉 X 處橫搖峰值 / クロッシング部のロールピーク / Frog-crossing roll peak.
		frogPeakSwayM: 0.015,      // 轍叉 X 處橫移峰值 / クロッシング部の横変位ピーク / Frog-crossing sway peak.
		frogBounceImpulse: 0.128,  // 轍叉 X 處上下震動 / クロッシング部の上下動 / Frog-crossing vertical impulse.
		bounceFrequencyHz: 2.10,   // 道岔上下回彈頻率 / 分岐器上下動周波数 / Turnout bounce frequency.
		bounceDamping: 0.1297      // 道岔上下回彈持續時間 / 分岐器上下動減衰 / Turnout bounce damping.
	},
	//----------------------------------------------------------------------
	// 制動與停車衝動 / 制動・停止衝動 / BRAKING AND STOP SHOCK
	// 急制動建立與停車瞬間的前後俯仰、前後位移。 / 急制動の立ち上がりと停止瞬間の前後ピッチ・前後変位。 / Fore-aft pitch and longitudinal shift when emergency braking builds up and at the moment of stopping.
	//----------------------------------------------------------------------
	stop: {
		maxPitchDeg: 0.65,              // 制動相關最大俯仰角 / 制動系の最大ピッチ角 / Maximum braking-related pitch angle.
		maxShiftM: 0.040,               // 制動相關最大前後位移 / 制動系の最大前後変位 / Maximum braking-related longitudinal shift.
		emergencyDecelMps2: 1.15,       // 急制動判定減速度 / 急制動判定の減速度 / Deceleration threshold for emergency response.
		emergencyJerkMps3: 2.00,        // 急制動判定減速度變化率 / 急制動判定のジャーク / Jerk threshold for emergency response.
		emergencyPitchImpulse: 0.0376,  // 急制動上下俯仰衝量 / 急制動時のピッチ衝撃 / Emergency-brake pitch impulse.
		emergencyShiftImpulseM: 0.020,  // 急制動前後位移衝量 / 急制動時の前後変位衝撃 / Emergency-brake longitudinal impulse.
		minimumBrakeLevel: 5,           // B5 起才顯示停車衝動 / B5以上で停止衝動を表示 / Stop shock begins at B5.
		minimumDecelMps2: 0.75,         // 停車衝動最低近期減速度 / 停止衝動の最小減速度 / Minimum recent deceleration for stop shock.
		pitchImpulse: 0.098,            // 停車前後俯仰強度 / 停止時ピッチ強度 / Stop pitch impulse.
		shiftImpulseM: 0.026,           // 停車前後位移強度 / 停止時前後変位強度 / Stop longitudinal-shift impulse.
		notchFactors: [0.0, 0.0, 0.0, 0.0, 0.0, 0.50, 0.75, 1.05, 1.45], // B5/B6/B7/EB 倍率 / B5/B6/B7/EB倍率 / B5/B6/B7/EB multipliers.
		pitchFrequencyHz: 0.72,         // 停車俯仰回彈頻率 / 停止ピッチ周波数 / Stop-pitch frequency.
		pitchDamping: 0.14,             // 停車俯仰持續時間 / 停止ピッチ減衰 / Stop-pitch damping.
		shiftFrequencyHz: 0.78,         // 停車前後位移頻率 / 停止前後変位周波数 / Stop-shift frequency.
		shiftDamping: 0.28              // 停車前後位移持續時間 / 停止前後変位減衰 / Stop-shift damping.
	},
	//----------------------------------------------------------------------
	// 乘客載重懸吊 / 乗客荷重サスペンション / PASSENGER-LOAD SUSPENSION
	// 偵測站在或坐在本節車上的玩家與 NPC：載重偏向的一側下沉（例：從左門下車→左側變輕→車體倒向右側），再由空氣彈簧調平閥慢慢回到水平。 /
	// 本車に立つ・座るプレイヤーとNPCを検出し、荷重の偏った側が沈みます（例：左扉から降車→左が軽くなり車体は右へ傾く）。その後、空気ばねの自動高さ調整弁でゆっくり水平へ戻ります。 /
	// Detects players and NPCs standing or seated in this car: the loaded side sinks (e.g. alighting from the left door lightens the left, so the body tilts right), then the air-spring leveling valve slowly restores level.
	// 真實一人約 70 kg、一節車約 30 t，實際傾斜僅約 0.01～0.05°；以下數值為可見度而放大。 / 実際は1人約70 kg・1両約30 tで傾きは約0.01～0.05°しかなく、以下は視認性のため誇張した値です。 / Real tilt is only ~0.01-0.05° (70 kg person vs ~30 t car); the values below are exaggerated for visibility.
	// 支援 1.7.10（KaizPatchX）、1.12.2（RTM 2.4.x）、RTMU 1.21.1；版本差異由 RTMBodyMotionAdapter.js 處理。 / 1.7.10（KaizPatchX）・1.12.2（RTM 2.4.x）・RTMU 1.21.1に対応し、版差はRTMBodyMotionAdapter.jsが吸収します。 / Supports 1.7.10 (KaizPatchX), 1.12.2 (RTM 2.4.x) and RTMU 1.21.1; RTMBodyMotionAdapter.js absorbs the version differences.
	//----------------------------------------------------------------------
	load: {
		enabled: true,                 // 是否啟用乘客載重效果 / 乗客荷重効果を有効にするか / Enable the passenger-load effect.
		rollPerPersonDeg: 0.15,        // 一人站在車門位置（rollReferenceWidthM）時的傾斜角 / 1人が扉位置（rollReferenceWidthM）に立った時の傾斜角 / Tilt per person standing at the door position (rollReferenceWidthM).
		levelingTimeS: 3.5,            // 空氣彈簧調平時間常數；越小回正越快 / 空気ばね高さ調整の時定数；小さいほど早く水平に戻る / Air-spring leveling time constant; smaller returns to level faster.
		countNpcs: true,               // 是否把 NPC、村民等非玩家生物也算進載重 / NPC・村人など非プレイヤー生物も荷重に含めるか / Count NPCs, villagers and other non-player living entities.
		npcWeight: 1.0,                // NPC 相對於玩家的重量倍率 / プレイヤーに対するNPCの重量倍率 / NPC weight relative to a player.
		pitchPerPersonDeg: 0.05,       // 一人站在車端時的前後俯仰角 / 1人が車端に立った時の前後ピッチ角 / Fore-aft pitch per person standing at the car end.
		sinkPerPersonM: 0.0015,        // 每人造成的整體下沉量（之後同樣調平回升） / 1人あたりの全体沈下量（その後同様に復帰） / Overall sink per person, also leveled back afterwards.
		maxRollDeg: 0.80,              // 載重傾斜上限 / 荷重傾斜の上限 / Maximum load-induced roll.
		maxPitchDeg: 0.30,             // 載重俯仰上限 / 荷重ピッチの上限 / Maximum load-induced pitch.
		maxSinkM: 0.010,               // 載重下沉上限 / 荷重沈下の上限 / Maximum load-induced sink.
		boardKickRollDeg: 0.12,        // 上下車瞬間的踏步衝擊峰值（車門位置一人）；上車往該側沉、下車反彈，之後來回晃動；0=關閉 / 乗降瞬間の踏み込み衝撃ピーク（扉位置1人）；乗車側へ沈み降車で跳ね返り、その後揺れ返す；0=無効 / Step-on/off jolt peak per person at the door; boarding dips that side, alighting rebounds, then it swings; 0 disables.
		boardKickSinkM: 0.002,         // 上下車瞬間的上下衝擊峰值（每人） / 乗降瞬間の上下衝撃ピーク（1人あたり） / Vertical jolt peak per person at the moment of boarding or alighting.

		// —— 進階：一般不需修改 / 上級：通常は変更不要 / Advanced: normally leave as is ——
		inputSmoothingS: 0.30,         // 載重輸入平滑時間，減少車內走動造成的細碎抖動 / 荷重入力の平滑時間；車内歩行による細かな揺れを抑える / Load-input smoothing time; damps jitter from walking inside the car.
		rollReferenceWidthM: 1.40,     // 車門位置距中心線的寬度；站在此處即為一人份傾斜 / 扉位置の中心線からの距離；ここで1人分の傾斜 / Door distance from the centerline; standing here gives one person's tilt.
		carHalfWidthM: 1.55,           // 判定在車內的半寬 / 車内判定の半幅 / Half width counted as inside the car.
		carHalfLengthM: 0.0,           // 判定在車內的半長；0=自動讀取車輛設定 trainDistance / 車内判定の半長；0=車両設定trainDistanceを自動取得 / Half length counted as inside; 0 reads trainDistance from the vehicle config.
		fallbackHalfLengthM: 10.0,     // 自動讀取失敗時的半長 / 自動取得失敗時の半長 / Half length used when auto-detection fails.
		feetBelowFloorM: 2.5,          // 腳底低於地板估計值此值以內仍算在車上；實測平走進車時腳底比估計低 1 m 以上（只有跳進去才被偵測），故放寬 / 足元が推定床よりこの値以内下でも乗車扱い；実測で平地歩行の乗車は推定より1 m以上低く（ジャンプ時のみ検出）、範囲を広げました / Feet up to this far below the estimated floor still count; in-game, walking in put the feet over 1 m below the estimate (only jumping was detected), so this is widened.
		feetAboveFloorM: 2.2,          // 腳底高於地板此值以內算在車上；可排除站在車頂的人 / 足元が床よりこの値以内上なら乗車扱い；屋根上の人を除外 / Feet up to this far above the floor count as aboard; excludes people on the roof.
		floorOffsetM: { legacy1710: 0.0, legacy1122: 1.1875, rtmu: 1.1875 }, // 地板相對列車 posY 的高度（依版本） / 列車posYからの床高さ（版別） / Floor height above the train's posY per platform.
		legacyPlayerEyeOffsetM: 1.62,  // 1.7.10 玩家 posY 的眼高偏移 / 1.7.10プレイヤーposYの目線オフセット / Eye offset included in a 1.7.10 player's posY.
		excludedClassNames: []         // 不計入載重的實體類別全名（例：自訂裝飾實體） / 荷重に含めないエンティティのクラス完全名（例：独自の装飾エンティティ） / Fully qualified entity class names to ignore (e.g. custom decoration entities).
	},
	//----------------------------------------------------------------------
	// 除錯 / デバッグ / DEBUG
	// 平常保持預設值；只在排查問題時開啟。 / 通常は既定値のまま；問題調査時のみ有効にします。 / Keep the defaults normally; enable only when diagnosing problems.
	//----------------------------------------------------------------------
	debug: {
		// true 時每 5 秒在記錄檔輸出 partialTick 統計，用來確認幀間插值是否正常。 / trueで5秒ごとにpartialTick統計をログ出力し、フレーム補間を確認します。 / When true, log partialTick statistics every 5 s to verify frame interpolation.
		logPartialTick: false,
		// true 時在乘客人數或位置明顯改變時於記錄檔輸出每節車的載重偵測結果，用來確認上下車是否被偵測到。 / trueで乗客数や位置が大きく変わった時、各車の荷重検出結果をログ出力し、乗降が検出されているか確認します。 / When true, log each car's detected load whenever passenger count or position changes noticeably, to confirm boarding/alighting is detected.
		logLoad: false,
		// 描畫對照實驗（找出白色細縫的來源用；平常保持 0）。 / 描画対照実験（白い細線の原因調査用；通常は0）。 / Rendering A/B test for locating the thin white seam line; keep 0 normally.
		// 0＝正常；1＝完全不套用車體晃動；2＝只有平移（不旋轉）；3＝只有旋轉（不平移）；4＝發光 Pass 不使用深度偏移與關閉深度寫入（還原為原作者的設定）。 /
		// 0＝通常；1＝車体動揺を一切適用しない；2＝平行移動のみ（回転なし）；3＝回転のみ（平行移動なし）；4＝発光Passで深度オフセットと深度書込停止を使わない（原作者の設定に戻す）。 /
		// 0 = normal; 1 = no body motion at all; 2 = translation only (no rotation); 3 = rotation only (no translation); 4 = emissive pass without polygon offset / depth-write disable (original author's setup).
		renderTest: 0
	}
};