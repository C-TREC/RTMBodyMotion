//=============================================================================
// RTM 車體搖擺平台適配器 v1.1 / RTM車体動揺プラットフォームアダプター v1.1 / RTM BODY-MOTION PLATFORM ADAPTER v1.1
//=============================================================================
// 製作：C-TREC & 月島重工 / 制作：C-TREC & 月島重工 / Made by C-TREC & 月島重工
// 授權：可自由使用、修改與再發布；使用時須在列車的 readme 中標明「使用了 C-TREC & 月島重工 製作的晃動 JS」。詳見 ライセンス_License.txt。 /
// ライセンス：自由に使用・改変・再配布できます。使用する場合は車両のreadmeに「C-TREC & 月島重工 制作の動揺JSを使用」と明記してください。詳細は ライセンス_License.txt。 /
// License: free to use, modify and redistribute; when used, the vehicle's readme must state that it uses the body-motion JS made by C-TREC & 月島重工. See ライセンス_License.txt.
// 本檔案不含車種專用模型名稱，可直接隨其他車輛腳本一同安裝。 / 本ファイルは車種固有のモデル名を含まず、他車両へそのまま導入できます。 / This file contains no train-specific model names and can be installed with other vehicle scripts.
// 速度基準：RTM 原始速度 ×72 = km/h，×20 = m/s。 / 速度基準：RTM生速度×72＝km/h、×20＝m/s。 / Speed convention: raw RTM speed ×72 = km/h and ×20 = m/s.
var RTMBodyMotionAdapter = (function () {
	var PLATFORM_LEGACY = "legacy-rtm";
	var PLATFORM_RTMU_121 = "rtmu-1.21.1";
	var reflectedRailFields = {};

	function clamp(value, min, max) {
		return Math.max(min, Math.min(max, value));
	}

	function finiteNumber(value, fallback) {
		var number = Number(value);
		return isFinite(number) ? number : fallback;
	}

	function classNameOf(object) {
		try { return String(object.getClass().getName()); } catch (e) {}
		return "";
	}

	function readRuntimeInfo() {
		var minecraftVersion = "unknown";
		var rtmVersion = "unknown";
		try { minecraftVersion = String(NGTUtil.getMCVersion()); } catch (e1) {}
		try { rtmVersion = String(RTMCore.VERSION); } catch (e2) {}
		var lowerRtmVersion = rtmVersion.toLowerCase();
		var isRtmu121 = minecraftVersion.indexOf("1.21.1") >= 0 ||
			lowerRtmVersion.indexOf("remaster-1.21.1") >= 0 ||
			lowerRtmVersion.indexOf("realtrainmodunofficial") >= 0;
		// RTMU 的 RTMCore.VERSION 也含「1.7.10」字樣，因此必須先排除 RTMU。 / RTMUのRTMCore.VERSIONにも「1.7.10」が含まれるため、先にRTMUを除外します。 / RTMU's RTMCore.VERSION also contains "1.7.10", so exclude RTMU first.
		var isLegacy1710 = !isRtmu121 &&
			(minecraftVersion.indexOf("1.7.10") >= 0 || rtmVersion.indexOf("1.7.10") >= 0);
		return {
			platformId: isRtmu121 ? PLATFORM_RTMU_121 : PLATFORM_LEGACY,
			legacy1710: isLegacy1710,
			minecraftVersion: minecraftVersion,
			rtmVersion: rtmVersion
		};
	}

	var runtime = readRuntimeInfo();

	function isRTMU121() {
		return runtime.platformId == PLATFORM_RTMU_121;
	}

	function isLegacy1710() {
		return runtime.legacy1710 === true;
	}

	// RTMU 的部分描畫路徑會傳入相容包裝物件；主要路徑則直接傳入 EntityTrain。 / RTMUの一部描画経路は互換ラッパーを渡し、主経路はEntityTrainを直接渡します。 / Some RTMU render paths pass a compatibility wrapper, while the main path passes EntityTrain directly.
	// 先以 typeof 確認有 getEntity() 才呼叫：RTMU 的 TrainEntity 與原版實體沒有此方法，原寫法每次都靠拋出例外判斷，而這裡每 tick 會被呼叫數十次（Nashorn 例外成本很高）。 /
	// typeofでgetEntity()の有無を確認してから呼びます。RTMUのTrainEntityやバニラ実体には無く、旧実装は毎回例外で判定していましたが、ここは毎tick数十回呼ばれます（Nashornの例外は高コスト）。 /
	// Check with typeof that getEntity() exists before calling: RTMU's TrainEntity and vanilla entities lack it, the old code detected that by throwing every time, and this runs dozens of times per tick (Nashorn exceptions are expensive).
	function unwrapEntity(entity) {
		if (entity == null || !isRTMU121()) return entity;
		if (typeof entity.getEntity !== "function") return entity;
		try {
			var raw = entity.getEntity();
			if (raw != null) return raw;
		} catch (e) {}
		return entity;
	}

	function getEntityId(entity) {
		var raw = unwrapEntity(entity);
		var id = -1;
		try { id = Number(MCWrapper.getEntityId(raw)); } catch (e1) {}
		if (isFinite(id) && id >= 0) return id;
		try { return Number(java.lang.System.identityHashCode(raw)); } catch (e2) {}
		return -1;
	}

	function getX(entity) {
		try { return finiteNumber(MCWrapper.getPosX(unwrapEntity(entity)), 0.0); } catch (e) {}
		return 0.0;
	}

	function getY(entity) {
		try { return finiteNumber(MCWrapper.getPosY(unwrapEntity(entity)), 0.0); } catch (e) {}
		return 0.0;
	}

	function getZ(entity) {
		try { return finiteNumber(MCWrapper.getPosZ(unwrapEntity(entity)), 0.0); } catch (e) {}
		return 0.0;
	}

	function getYaw(entity) {
		try { return finiteNumber(MCWrapper.getYaw(unwrapEntity(entity)), 0.0); } catch (e) {}
		return 0.0;
	}

	function getRawSpeed(entity) {
		var raw = unwrapEntity(entity);
		try { return finiteNumber(raw.getSpeed(), 0.0); } catch (e1) {}
		try { return finiteNumber(entity.getSpeed(), 0.0); } catch (e2) {}
		return 0.0;
	}

	function getSpeedKmh(entity) {
		return getRawSpeed(entity) * 72.0;
	}

	function getSpeedMps(entity) {
		return getRawSpeed(entity) * 20.0;
	}

	// Minecraft Vec3 的座標欄位：NeoForge（Mojang 名稱）為 x/y/z，Fabric 正式環境為 intermediary 名稱 field_1352/field_1351/field_1350；原寫法只讀 x/y/z，在 Fabric 會讀不到而退回列車中心。 /
	// Minecraft Vec3の座標フィールド：NeoForge（Mojang名）はx/y/z、Fabric本番はintermediary名field_1352/field_1351/field_1350です。旧実装はx/y/zのみでFabricでは読めず列車中心に戻っていました。 /
	// Minecraft Vec3 coordinate fields: x/y/z on NeoForge (Mojang names), intermediary field_1352/field_1351/field_1350 in Fabric production; the old code read only x/y/z, which fails on Fabric and fell back to the train center.
	function vecComponent(vec, name, intermediary, fallback) {
		var value = vec[name];
		if (value === undefined || value === null) value = vec[intermediary];
		return finiteNumber(value, fallback);
	}

	function mapRTMUBogieIndex(raw, index) {
		try { return Number(raw.scriptBogieIndexToDefinitionIndex(index)); } catch (e) {}
		return index;
	}

	// 回傳統一格式的轉向架樣本。 / 統一形式の台車サンプルを返します。 / Return a normalized bogie sample.
	function readBogie(entity, index, fallbackX, fallbackY, fallbackZ) {
		var raw = unwrapEntity(entity);
		var rawName = classNameOf(raw);
		var modernNative = rawName.indexOf("com.portofino.realtrainmodunofficial.entity.TrainEntity") >= 0;
		if (modernNative) {
			try {
				var mapped = mapRTMUBogieIndex(raw, index);
				var pos = raw.getBogieWorldPosition(mapped);
				return {
					entity: raw,
					nativeBogie: null,
					index: mapped,
					x: vecComponent(pos, "x", "field_1352", fallbackX),
					y: vecComponent(pos, "y", "field_1351", fallbackY),
					z: vecComponent(pos, "z", "field_1350", fallbackZ),
					roll: finiteNumber(raw.getBogieRoll(mapped), 0.0),
					modernNative: true
				};
			} catch (e1) {}
		}
		try {
			var bogie = raw.getBogie(index);
			if (bogie != null) {
				return {
					entity: raw,
					nativeBogie: bogie,
					index: index,
					x: finiteNumber(MCWrapper.getPosX(bogie), fallbackX),
					y: finiteNumber(MCWrapper.getPosY(bogie), fallbackY),
					z: finiteNumber(MCWrapper.getPosZ(bogie), fallbackZ),
					roll: finiteNumber(bogie.rotationRoll, 0.0),
					modernNative: false
				};
			}
		} catch (e2) {}
		return {
			entity: raw,
			nativeBogie: null,
			index: index,
			x: fallbackX,
			y: fallbackY,
			z: fallbackZ,
			roll: 0.0,
			modernNative: modernNative
		};
	}

	function readCantDegrees(entity) {
		var x = getX(entity);
		var y = getY(entity);
		var z = getZ(entity);
		return readCantFromSamples(entity, function () {
			return [readBogie(entity, 0, x, y, z), readBogie(entity, 1, x, y, z)];
		});
	}

	// 以已讀取的轉向架樣本計算超高，避免同一 tick 重複讀取轉向架；samples 可為陣列或回傳陣列的函式（僅在需要時才讀）。 /
	// 読取済みの台車サンプルからカントを計算し、同一tickの重複読取を避けます。samplesは配列、または必要時のみ読む関数です。 /
	// Compute cant from already-read bogie samples to avoid reading the bogies twice per tick; samples may be an array or a function returning one (read only when needed).
	function readCantFromSamples(entity, samples) {
		var raw = unwrapEntity(entity);
		if (classNameOf(raw).indexOf("com.portofino.realtrainmodunofficial.entity.TrainEntity") >= 0) {
			try { return finiteNumber(raw.getBodyRoll(), 0.0); } catch (e1) {}
		}
		var pair = typeof samples === "function" ? samples() : samples;
		return (pair[0].roll - pair[1].roll) * 0.5;
	}

	function isSwitchCore(core) {
		if (core == null) return false;
		try { if (core instanceof TileEntityLargeRailSwitchCore) return true; } catch (e1) {}
		try { return classNameOf(core).indexOf("TileEntityLargeRailSwitchCore") >= 0; } catch (e2) {}
		return false;
	}

	function directRailCore(sample) {
		var bogie = sample != null ? sample.nativeBogie : null;
		if (bogie == null) return null;
		var className = classNameOf(bogie);
		// RTMU 優先使用公開 Getter，避免不必要的反射。1.7.10／1.12.2 的 EntityBogie 沒有此方法，先以 typeof 確認，避免每 tick 拋出例外。 /
		// RTMUでは公開Getterを優先し不要なリフレクションを避けます。1.7.10／1.12.2のEntityBogieには無いため、typeofで確認し毎tickの例外を避けます。 /
		// Prefer RTMU's public getter to avoid unnecessary reflection. EntityBogie on 1.7.10/1.12.2 lacks it, so check with typeof to avoid an exception every tick.
		if (typeof bogie.getCurrentRailObj === "function") {
			try {
				var publicCore = bogie.getCurrentRailObj();
				if (publicCore != null) return publicCore;
			} catch (e1) {}
		}
		var field = reflectedRailFields[className];
		if (field === null) return null;   // 已確認此類別沒有該欄位 / このクラスにフィールドが無いと確認済み / Already known: no such field on this class.
		try {
			if (field === undefined) {
				try {
					field = bogie.getClass().getDeclaredField("currentRailObj");
					field.setAccessible(true);
				} catch (missing) {
					reflectedRailFields[className] = null;
					return null;
				}
				reflectedRailFields[className] = field;
			}
			return field.get(bogie);
		} catch (e2) {}
		return null;
	}

	// getRailFromCoordinates 在 1.12.2 只有 5 個參數的多載，1.7.10 KaizPatchX 只有 4 個參數。原寫法每次都先試 5 個參數、回傳 null 再試 4 個參數，
	// 不存在的那一種每次都會拋出例外。第一次成功（不論是否找到鋼軌）後就只使用該多載；兩者都尚未成功過時維持原本的嘗試順序，因此結果完全相同。 /
	// getRailFromCoordinatesは1.12.2が5引数、1.7.10 KaizPatchXが4引数のオーバーロードのみです。旧実装は毎回5引数→null時に4引数を試し、存在しない方が毎回例外になりました。
	// 一度成功（レールの有無を問わず）したらそのオーバーロードのみ使い、まだどちらも成功していなければ従来の順序を維持するため、結果は同一です。 /
	// getRailFromCoordinates has only a 5-argument overload on 1.12.2 and only a 4-argument one on 1.7.10 KaizPatchX. The old code tried 5 then (on null) 4 every time, so the missing overload threw each call.
	// After the first successful call (rail found or not) only that overload is used; until one succeeds the original order is kept, so results are identical.
	var railLookupArity = 0;
	function lookupRail(world, x, y, z) {
		if (railLookupArity == 5) return TileEntityLargeRailBase.getRailFromCoordinates(world, x, y, z, 0);
		if (railLookupArity == 4) return TileEntityLargeRailBase.getRailFromCoordinates(world, x, y, z);
		var rail = null;
		try { rail = TileEntityLargeRailBase.getRailFromCoordinates(world, x, y, z, 0); railLookupArity = 5; } catch (e1) {}
		if (rail == null && railLookupArity != 5) {
			try { rail = TileEntityLargeRailBase.getRailFromCoordinates(world, x, y, z); railLookupArity = 4; } catch (e2) {}
		}
		return rail;
	}

	function findRailCoreAt(sample) {
		if (sample == null || sample.entity == null) return null;
		try {
			var world = MCWrapper.getWorld(sample.entity);
			if (world == null) world = NGTUtil.getClientWorld();
			if (world == null) return null;
			var offsets = [0.0, 2.0, 1.0, -1.0, 3.0, -2.0];
			for (var i = 0; i < offsets.length; ++i) {
				var rail = null;
				try { rail = lookupRail(world, sample.x, sample.y + offsets[i], sample.z); } catch (e1) {}
				if (rail != null) {
					var core = rail.getRailCore();
					if (isSwitchCore(core)) return core;
				}
			}
		} catch (e3) {}
		return null;
	}

	function getSwitchCore(sample) {
		var direct = directRailCore(sample);
		if (isSwitchCore(direct)) return direct;
		return findRailCoreAt(sample);
	}

	// 讀取車輛 DataMap 的 double 值；舊版 RTM 無 DataMap 或鍵不存在時回傳 fallback。 / 車両DataMapのdouble値を読みます。旧RTMでDataMapがない場合などはfallbackを返します。 / Read a double from the vehicle DataMap; return fallback when legacy RTM has no DataMap.
	// 注意：RTM 對未設定的鍵回傳 0，呼叫端應將 0 視為「未調整」。 / 注意：RTMは未設定キーに0を返すため、呼び出し側は0を「調整なし」として扱ってください。 / Note: RTM returns 0 for unset keys, so callers should treat 0 as "no adjustment".
	function readDataMapDouble(entity, key, fallback) {
		var raw = unwrapEntity(entity);
		var targets = raw !== entity ? [entity, raw] : [entity];
		for (var i = 0; i < targets.length; ++i) {
			try {
				var dataMap = targets[i].getResourceState().getDataMap();
				if (dataMap == null) continue;
				return finiteNumber(dataMap.getDouble(key), fallback);
			} catch (e) {}
		}
		return fallback;
	}

	//-------------------------------------------------------------------------
	// 遊戲 tick / ゲームtick / GAME TICK
	//-------------------------------------------------------------------------
	// 正式環境的原版名稱經混淆，腳本直接寫 getTotalWorldTime() 在三個版本都找不到。優先使用實體自己的 tick 計數：每個客戶端 tick 加 1，與 RTM 的 partialTick 同步，且不受伺服器時間同步修正。
	// 名稱：1.7.10／1.12.2 為 field_70173_aa（ticksExisted），RTMU NeoForge 為 tickCount，Fabric 為 field_6012（age）。 /
	// 本番環境のバニラ名は難読化され、getTotalWorldTime()は3バージョンとも見つかりません。実体自身のtickカウンタを優先します。クライアントtickごとに1増え、RTMのpartialTickと同期し、サーバーの時刻同期補正も受けません。
	// 名前：1.7.10／1.12.2はfield_70173_aa（ticksExisted）、RTMU NeoForgeはtickCount、Fabricはfield_6012（age）。 /
	// Vanilla names are obfuscated in production, so a plain getTotalWorldTime() fails on all three platforms. Prefer the entity's own tick counter: it advances once per client tick, stays in step with RTM's partialTick, and is never corrected by server time sync.
	// Names: field_70173_aa (ticksExisted) on 1.7.10/1.12.2, tickCount on RTMU NeoForge, field_6012 (age) on Fabric.
	var ENTITY_TICK_FIELDS = ["field_70173_aa", "ticksExisted", "tickCount", "field_6012"];
	// 備援：世界總時間。1.7.10／1.12.2 為 func_82737_E，NeoForge 為 getGameTime，Fabric 為 method_8510；伺服器同步時可能跳動。 / 予備：ワールド総時間。1.7.10／1.12.2はfunc_82737_E、NeoForgeはgetGameTime、Fabricはmethod_8510で、サーバー同期時に飛ぶ場合があります。 / Fallback: total world time. func_82737_E on 1.7.10/1.12.2, getGameTime on NeoForge, method_8510 on Fabric; may jump on server sync.
	var WORLD_TIME_METHODS = ["func_82737_E", "getTotalWorldTime", "getGameTime", "method_8510"];

	function getEntityTick(entity) {
		var raw = unwrapEntity(entity);
		for (var i = 0; i < ENTITY_TICK_FIELDS.length; ++i) {
			try {
				var value = raw[ENTITY_TICK_FIELDS[i]];
				if (typeof value === "function") continue;
				var tick = Number(value);
				if (value !== undefined && value !== null && isFinite(tick)) return tick;
			} catch (e) {}
		}
		return null;
	}

	function getWorldTick() {
		var world = null;
		try { world = NGTUtil.getClientWorld(); } catch (e1) {}
		if (world == null) return null;
		for (var i = 0; i < WORLD_TIME_METHODS.length; ++i) {
			try {
				var tick = Number(world[WORLD_TIME_METHODS[i]]());
				if (isFinite(tick)) return tick;
			} catch (e2) {}
		}
		return null;
	}

	//-------------------------------------------------------------------------
	// 乘客偵測 / 乗客検出 / PASSENGER DETECTION
	//-------------------------------------------------------------------------
	// 三個版本皆提供 MCWrapper.getEntities(world, x1,y1,z1, x2,y2,z2)：1.7.10 KaizPatchX、1.12.2 NGTLib 收 World；RTMU 收 Object 並自動拆包裝。RTMU 1.0.4 等舊版沒有此方法，回傳 null 表示不支援。 /
	// 3バージョンともMCWrapper.getEntitiesを提供します。1.7.10 KaizPatchX・1.12.2 NGTLibはWorld、RTMUはObjectを受け自動でラッパーを解除します。RTMU 1.0.4などの旧版には無く、nullで非対応を示します。 /
	// All three platforms provide MCWrapper.getEntities: 1.7.10 KaizPatchX and 1.12.2 NGTLib take a World; RTMU takes an Object and unwraps it. Older RTMU builds such as 1.0.4 lack it; null means unsupported.
	function getEntitiesAround(entity, x1, y1, z1, x2, y2, z2) {
		var raw = unwrapEntity(entity);
		var world = null;
		try { world = MCWrapper.getWorld(raw); } catch (e1) {}
		if (world == null) {
			try { world = NGTUtil.getClientWorld(); } catch (e2) {}
		}
		if (world == null) return null;
		try {
			var list = MCWrapper.getEntities(world, x1, y1, z1, x2, y2, z2);
			if (list == null) return [];
			var result = [];
			for (var i = 0; i < list.size(); ++i) result.push(list.get(i));
			return result;
		} catch (e3) {}
		return null;
	}

	// 執行時的類別名稱：1.7.10／1.12.2 Forge 為 MCP 名稱，RTMU NeoForge 為 Mojang 名稱，RTMU Fabric 為 intermediary 名稱。 / 実行時クラス名：1.7.10／1.12.2 ForgeはMCP名、RTMU NeoForgeはMojang名、RTMU Fabricはintermediary名です。 / Runtime class names: MCP on 1.7.10/1.12.2 Forge, Mojang on RTMU NeoForge, intermediary on RTMU Fabric.
	var PLAYER_CLASS_NAMES = {
		"net.minecraft.entity.player.EntityPlayer": true,
		"net.minecraft.world.entity.player.Player": true,
		"net.minecraft.class_1657": true
	};
	var LIVING_CLASS_NAMES = {
		"net.minecraft.entity.EntityLivingBase": true,
		"net.minecraft.world.entity.LivingEntity": true,
		"net.minecraft.class_1309": true
	};
	var EXCLUDED_CLASS_NAMES = {
		"net.minecraft.entity.item.EntityArmorStand": true,
		"net.minecraft.world.entity.decoration.ArmorStand": true,
		"net.minecraft.class_1531": true
	};
	var entityKindCache = {};

	// 回傳 "player"、"living"（NPC、村民等）或 null（非生物、盔甲座、車輛零件）；extraExcluded 為使用者追加的排除類別名稱。 / "player"、"living"（NPC・村人など）またはnull（非生物・防具立て・車両部品）を返します。extraExcludedは利用者が追加する除外クラス名です。 / Returns "player", "living" (NPCs, villagers, ...) or null (non-living, armor stands, vehicle parts); extraExcluded holds user-added class names to skip.
	function classifyEntity(object, extraExcluded) {
		var name = classNameOf(object);
		if (name === "") return null;
		if (extraExcluded && extraExcluded[name]) return null;
		if (entityKindCache.hasOwnProperty(name)) return entityKindCache[name];
		var kind = null;
		try {
			var cls = object.getClass();
			while (cls != null) {
				var clsName = String(cls.getName());
				if (EXCLUDED_CLASS_NAMES[clsName]) { kind = null; break; }
				if (PLAYER_CLASS_NAMES[clsName]) { kind = "player"; break; }
				if (LIVING_CLASS_NAMES[clsName]) { kind = "living"; break; }
				cls = cls.getSuperclass();
			}
		} catch (e) {}
		entityKindCache[name] = kind;
		return kind;
	}

	// 取得乘坐中的對象（座位或車輛）；未乘坐回傳 null。正式環境方法名稱經混淆：1.12.2 為 func_184187_bx（getRidingEntity），1.7.10 為欄位 field_70154_o（ridingEntity），RTMU NeoForge 為 getVehicle，Fabric 為 method_5854；開發環境名稱一併嘗試。 /
	// 乗っている対象（座席・車両）を返し、未乗車ならnull。本番環境のメソッド名は難読化され、1.12.2はfunc_184187_bx（getRidingEntity）、1.7.10はフィールドfield_70154_o（ridingEntity）、RTMU NeoForgeはgetVehicle、Fabricはmethod_5854です。開発環境名も試します。 /
	// Returns the mount (seat or vehicle) or null. Production names are obfuscated: func_184187_bx (getRidingEntity) on 1.12.2, field field_70154_o (ridingEntity) on 1.7.10, getVehicle on RTMU NeoForge, method_5854 on Fabric; dev names are tried too.
	// 先以 typeof 確認方法存在才呼叫：不存在的方法不再透過拋出例外來判斷（每 tick 每位乘客原本最多 4 次例外）。 / typeofでメソッドの存在を確認してから呼び、無いメソッドを例外で判定しません（従来は毎tick乗客ごとに最大4回の例外）。 / Check with typeof before calling, so missing methods are no longer detected by throwing (previously up to 4 exceptions per passenger per tick).
	function getRidingEntity(object) {
		var getters = ["func_184187_bx", "getRidingEntity", "getVehicle", "method_5854"];
		for (var i = 0; i < getters.length; ++i) {
			if (typeof object[getters[i]] !== "function") continue;
			try {
				var mount = object[getters[i]]();
				if (mount != null) return mount;
			} catch (e1) {}
		}
		var fields = ["field_70154_o", "ridingEntity"];
		for (var j = 0; j < fields.length; ++j) {
			try {
				var value = object[fields[j]];
				if (value != null && typeof value !== "function") return value;
			} catch (e2) {}
		}
		return null;
	}

	// 腳底高度：1.7.10 的 posY＝腳底＋yOffset（本機玩家 EntityPlayerSP 為 1.62，遠端玩家 EntityOtherPlayerMP 與多數生物為 0），因此直接讀取各實體的 yOffset（SRG 欄位 field_70129_M）；讀不到時玩家才假設 legacyPlayerEyeOffset。1.12.2 與 RTMU 的 posY 即腳底。 /
	// 足元の高さ：1.7.10のposYは足元＋yOffset（自機EntityPlayerSPは1.62、他プレイヤーEntityOtherPlayerMPや多くの生物は0）のため、各実体のyOffset（SRGフィールドfield_70129_M）を直接読みます。読めない場合のみプレイヤーにlegacyPlayerEyeOffsetを仮定します。1.12.2とRTMUはposYが足元です。 /
	// Feet height: on 1.7.10 posY = feet + yOffset (1.62 for the local EntityPlayerSP, 0 for remote EntityOtherPlayerMP and most mobs), so read each entity's yOffset (SRG field field_70129_M); only if unreadable assume legacyPlayerEyeOffset for players. On 1.12.2 and RTMU posY is the feet.
	function getFeetY(object, kind, legacyPlayerEyeOffset) {
		var y = 0.0;
		try { y = finiteNumber(MCWrapper.getPosY(object), 0.0); } catch (e) {}
		if (!isLegacy1710()) return y;
		var names = ["field_70129_M", "yOffset"];
		for (var i = 0; i < names.length; ++i) {
			try {
				var offset = Number(object[names[i]]);
				if (isFinite(offset)) return y - offset;
			} catch (e2) {}
		}
		return kind == "player" ? y - legacyPlayerEyeOffset : y;
	}

	// 車輛地板相對於列車 posY 的高度：1.7.10 的列車 yOffset 已含車高，地板約在 posY；1.12.2 與 RTMU 約在 posY+1.1875。 / 列車posYからの床高さ：1.7.10は列車yOffsetに車高を含み床はほぼposY、1.12.2とRTMUはposY+1.1875付近です。 / Floor height above the train's posY: 1.7.10 trains fold the height into yOffset so the floor is near posY; 1.12.2 and RTMU place it near posY+1.1875.
	function getFloorOffset(offsets) {
		if (isRTMU121()) return offsets.rtmu;
		return isLegacy1710() ? offsets.legacy1710 : offsets.legacy1122;
	}

	// 車輛半長（中心到車端）：RTMU 為 TrainEntity.getTrainDistance()（其 ConfigCompat 沒有 trainDistance），1.12.2 為 getResourceState().getResourceSet().getConfig()，1.7.10 為 getModelSet().getConfig()；取不到時用 fallback。 /
	// 車両半長（中心から車端）：RTMUはTrainEntity.getTrainDistance()（ConfigCompatにtrainDistanceが無い）、1.12.2はgetResourceState().getResourceSet().getConfig()、1.7.10はgetModelSet().getConfig()、取得不能時はfallbackです。 /
	// Car half length (center to end): RTMU uses TrainEntity.getTrainDistance() (its ConfigCompat lacks trainDistance), 1.12.2 uses getResourceState().getResourceSet().getConfig(), 1.7.10 uses getModelSet().getConfig(); otherwise fallback.
	// 依平台排列嘗試順序：各平台只有一條路徑可用，其餘路徑必定拋出例外，因此先試可用的那條，結果不變但不再每 tick 拋例外。 /
	// 平台ごとに試行順を並べます。各平台で使える経路は1つだけで他は必ず例外になるため、使える経路を先に試し、結果は同じまま毎tickの例外を無くします。 /
	// Order the attempts per platform: only one path works on each platform and the others always throw, so trying the working one first keeps the result while removing the per-tick exceptions.
	function halfLengthViaTrainDistance(target) { return Number(target.getTrainDistance()); }
	function halfLengthViaResourceState(target) { return Number(target.getResourceState().getResourceSet().getConfig().trainDistance); }
	function halfLengthViaModelSet(target) { return Number(target.getModelSet().getConfig().trainDistance); }
	function getCarHalfLength(entity, fallback) {
		var raw = unwrapEntity(entity);
		var targets = raw !== entity ? [raw, entity] : [raw];
		var readers = isRTMU121() ?
			[halfLengthViaTrainDistance, halfLengthViaResourceState, halfLengthViaModelSet] :
			[halfLengthViaResourceState, halfLengthViaModelSet, halfLengthViaTrainDistance];
		for (var i = 0; i < targets.length; ++i) {
			for (var k = 0; k < readers.length; ++k) {
				try {
					var value = readers[k](targets[i]);
					if (isFinite(value) && value > 1.0) return value;
				} catch (e) {}
			}
		}
		return fallback;
	}

	//-------------------------------------------------------------------------
	// JSON 行先（rollsigns）：RTM 在描畫腳本之外、用沒有晃動的座標畫行先，因此改由模組在晃動姿態裡代畫。
	// 第一次讀到某個車輛設定時，取出它的行先資料自己保存，並把記憶體中的設定清空，讓 RTM 不再畫原本那份；JSON 檔案不會被修改，行先選單照常運作。 /
	// JSON行先（rollsigns）：RTMは描画スクリプトの外で揺れていない座標に行先を描くため、モジュールが揺れの姿勢の中で代わりに描きます。
	// ある車両設定を初めて読んだときに行先データを取り出して保持し、メモリ上の設定を空にしてRTMが元の行先を描かないようにします。JSONファイルは変更せず、行先メニューもそのまま使えます。 /
	// JSON rollsigns: RTM draws them outside the render script with the unmoved transform, so the module redraws them inside the body pose.
	// The first time a vehicle config is seen, its rollsign data is copied out and the in-memory config is emptied so RTM stops drawing its own copy; the JSON file is untouched and the destination menu keeps working.
	//   1.12.2（RTM 2.4.x）：getResourceState().getResourceSet() 的 rollsignTexture 與 getConfig().rollsigns／rollsignNames
	//   1.7.10（KaizPatchX）：getModelSet() 的同名欄位
	//   RTMU 1.21.1：VehicleRegistry 的車輛定義（rollsigns 為唯讀清單，以 Java 反射換成空清單）；另含 RTMU 追加的種別幕（typeSigns）
	var rollsignCache = null;                              // 車輛設定 → 取出的行先資料（第一次使用時才建立，載入時不需要 Java）
	var rollsignFailed = {};                               // 讀取失敗的平台路徑，避免每幀重試並刷記錄
	var rollsignRestores = [];                             // 還原 RTM 原本行先設定的函式（代畫失敗時使用）

	function rollsignCacheMap() {
		if (rollsignCache == null) rollsignCache = new java.util.IdentityHashMap();
		return rollsignCache;
	}

	function javaIntOr(fn, fallback) {
		try { var v = Number(fn()); return isFinite(v) ? v : fallback; } catch (e) { return fallback; }
	}

	// 把一組面板轉成 JS 物件：{uMin, uMax, vMin, vMax, quads:[[x,y,z]×4], doAnimation, disableLighting}
	function convertPanel(uv, pos, doAnimation, disableLighting) {
		if (uv == null || uv.length < 4 || pos == null) return null;
		var quads = [];
		for (var q = 0; q < pos.length; ++q) {
			var quad = pos[q];
			if (quad == null || quad.length < 4) continue;
			var pts = [];
			for (var k = 0; k < 4; ++k) pts.push([Number(quad[k][0]), Number(quad[k][1]), Number(quad[k][2])]);
			quads.push(pts);
		}
		return { uMin: Number(uv[0]), uMax: Number(uv[1]), vMin: Number(uv[2]), vMax: Number(uv[3]),
			quads: quads, doAnimation: !!doAnimation, disableLighting: !!disableLighting };
	}

	function legacyModelSet(raw) {
		var readers = isLegacy1710() ?
			[function () { return raw.getModelSet(); }, function () { return raw.getResourceState().getResourceSet(); }] :
			[function () { return raw.getResourceState().getResourceSet(); }, function () { return raw.getModelSet(); }];
		for (var i = 0; i < readers.length; ++i) {
			try { var set = readers[i](); if (set != null) return set; } catch (e) {}
		}
		return null;
	}

	function legacyRollsignData(raw) {
		var modelSet = legacyModelSet(raw);
		if (modelSet == null) return null;
		var cfg = modelSet.getConfig();
		if (cfg == null) return null;
		var data = rollsignCacheMap().get(cfg);
		if (data == null) {
			var signs = cfg.rollsigns;
			if (signs == null || signs.length == 0 || modelSet.rollsignTexture == null) return null;
			var panels = [];
			for (var i = 0; i < signs.length; ++i) {
				var p = convertPanel(signs[i].uv, signs[i].pos, signs[i].doAnimation, signs[i].disableLighting);
				if (p != null) panels.push(p);
			}
			var names = cfg.rollsignNames;
			data = [{ texture: modelSet.rollsignTexture, count: Math.max(1, names == null ? 1 : names.length), panels: panels,
				stateId: 8, offset: 0.0 }];
			// 換成同型別的空陣列：RTM 的 renderRollsign 迴圈從此不畫任何面板
			cfg.rollsigns = java.lang.reflect.Array.newInstance(signs.getClass().getComponentType(), 0);
			rollsignRestores.push(function () { cfg.rollsigns = signs; });
			rollsignCache.put(cfg, data);
		}
		return data;
	}

	function rtmuRollsignData(raw) {
		var def = null;
		var Registry = Packages.com.portofino.realtrainmodunofficial.vehicle.VehicleRegistry;
		try { def = Registry.getById(raw.getModelName()); } catch (e1) {}
		if (def == null) { try { def = Registry.getById(raw.getVehicleId()); } catch (e2) {} }
		if (def == null) return null;
		var data = rollsignCacheMap().get(def);
		if (data == null) {
			var Loader = Packages.com.portofino.realtrainmodunofficial.client.model.MqoModelLoader;
			data = [];
			var groups = [
				{ panels: def.getRollsigns(), names: def.getRollsignNames(), texture: def.getRollsignTexture(), stateId: 8 },
				{ panels: def.getTypeSigns(), names: def.getTypeSignNames(), texture: def.getTypeSignTexture(), stateId: 12, type: true }
			];
			for (var g = 0; g < groups.length; ++g) {
				var grp = groups[g];
				if (grp.panels == null || grp.panels.isEmpty() || grp.texture == null || String(grp.texture).trim() == "") continue;
				var panels = [];
				for (var i = 0; i < grp.panels.size(); ++i) {
					var r = grp.panels.get(i);
					var p = convertPanel(r.uv(), r.pos(), r.doAnimation(), r.disableLighting());
					if (p != null) panels.push(p);
				}
				// RTMU 與 RTMU 自己的畫法相同：沿法線外推 1.5 mm，避免與車體表面深度競爭
				data.push({ texture: Loader.resolvePackTexture(def.getPackName(), grp.texture),
					count: Math.max(1, grp.names == null || grp.names.isEmpty() ? 1 : grp.names.size()),
					panels: panels, stateId: grp.stateId, type: !!grp.type, offset: 0.0015 });
			}
			// 唯讀清單無法清空，以 Java 反射把私有欄位換成空清單；種別幕有公開的 setter
			var field = def.getClass().getDeclaredField("rollsigns");
			field.setAccessible(true);
			var originalSigns = field.get(def);
			var typeNames = def.getTypeSignNames(), typeTexture = def.getTypeSignTexture(), originalTypes = def.getTypeSigns();
			field.set(def, java.util.Collections.emptyList());
			if (!originalTypes.isEmpty()) def.setTypeSign(typeNames, typeTexture, java.util.Collections.emptyList());
			rollsignRestores.push(function () {
				field.set(def, originalSigns);
				if (!originalTypes.isEmpty()) def.setTypeSign(typeNames, typeTexture, originalTypes);
			});
			rollsignCache.put(def, data);
		}
		return data;
	}

	// 列車狀態（8＝行先、12＝RTMU 種別）：1.7.10 與 RTMU 為 getTrainStateData(id)，1.12.2 為 getVehicleState(TrainState.getStateType(id))；先試本平台的寫法。 /
	// 列車状態（8＝行先、12＝RTMU種別）：1.7.10とRTMUはgetTrainStateData(id)、1.12.2はgetVehicleState(TrainState.getStateType(id))。自平台の書き方を先に試します。 /
	// Train state (8 = destination, 12 = RTMU type sign): getTrainStateData(id) on 1.7.10 and RTMU, getVehicleState(TrainState.getStateType(id)) on 1.12.2; the native form is tried first.
	function readTrainState(raw, id) {
		var viaData = function () { return raw.getTrainStateData(id); };
		var viaState = function () { return raw.getVehicleState(Packages.jp.ngt.rtm.entity.train.util.TrainState.getStateType(id)); };
		var order = (isLegacy1710() || isRTMU121()) ? [viaData, viaState] : [viaState, viaData];
		for (var i = 0; i < order.length; ++i) {
			var v = javaIntOr(order[i], NaN);
			if (isFinite(v)) return v;
		}
		return 0;
	}

	// 回傳本車要畫的行先組：[{texture, count, panels, index, animation, offset}]；沒有行先或無法讀取時回傳空陣列。
	function readRollsigns(entity) {
		var raw = unwrapEntity(entity);
		var path = isRTMU121() ? "rtmu" : "legacy";
		if (rollsignFailed[path]) return [];
		var data = null;
		try {
			data = isRTMU121() ? rtmuRollsignData(raw) : legacyRollsignData(raw);
		} catch (e) {
			restoreEngineRollsigns();
			try { NGTLog.debug("[BodyMotion] rollsign redraw disabled on " + path + ": " + e); } catch (e2) {}
			return [];
		}
		if (data == null) return [];
		var out = [];
		for (var i = 0; i < data.length; ++i) {
			var d = data[i];
			var rawIndex = readTrainState(raw, d.stateId);
			var index = ((rawIndex % d.count) + d.count) % d.count;
			// 種別幕沒有幕回し動畫，doAnimation 也直接顯示 index（與 RTMU 相同）
			var animation = d.type ? index : javaIntOr(function () { return raw.getRollsignAnimation(); }, index);
			out.push({ texture: d.texture, count: d.count, panels: d.panels, index: index, animation: animation, offset: d.offset });
		}
		return out;
	}

	// 代畫失敗時呼叫：把清空的設定全部還原，讓 RTM 照原本的方式畫行先（不晃，但不會消失）。 /
	// 代理描画に失敗したときに呼びます。空にした設定をすべて戻し、RTMが元の方法で行先を描くようにします（揺れませんが消えません）。 /
	// Called when the redraw fails: restore every emptied config so RTM draws the rollsigns its own way (unmoved, but not missing).
	function restoreEngineRollsigns() {
		for (var i = 0; i < rollsignRestores.length; ++i) {
			try { rollsignRestores[i](); } catch (e) {}
		}
		rollsignRestores = [];
		if (rollsignCache != null) rollsignCache.clear();
		rollsignFailed[isRTMU121() ? "rtmu" : "legacy"] = true;
	}

	function bindRollsignTexture(texture) {
		Packages.jp.ngt.ngtlib.util.NGTUtilClient.bindTexture(texture);
	}

	// RTMU 的腳本描畫是先記錄再重播：綁過貼圖後要明確回到模型的預設貼圖，否則之後的零件會沿用行先貼圖
	function restoreAfterRollsign() {
		if (isRTMU121()) {
			try { Packages.jp.ngt.ngtlib.util.NGTUtilClient.bindTexture(null); } catch (e) {}
		}
	}

	function normalizePartialTick(partialTick) {
		if (partialTick !== null && partialTick !== undefined) {
			var direct = Number(partialTick);
			if (isFinite(direct)) return clamp(direct, 0.0, 1.0);
		}
		if (isRTMU121()) {
			try {
				var rtmuPartial = Number(Packages.com.portofino.realtrainmodunofficial.client.ScriptClientCompat.currentRenderPartialTick);
				if (isFinite(rtmuPartial)) return clamp(rtmuPartial, 0.0, 1.0);
			} catch (e) {}
		}
		return 0.0;
	}

	return {
		PLATFORM_LEGACY: PLATFORM_LEGACY,
		PLATFORM_RTMU_121: PLATFORM_RTMU_121,
		runtime: runtime,
		isRTMU121: isRTMU121,
		isLegacy1710: isLegacy1710,
		getEntityTick: getEntityTick,
		getWorldTick: getWorldTick,
		getEntitiesAround: getEntitiesAround,
		classifyEntity: classifyEntity,
		getRidingEntity: getRidingEntity,
		classNameOf: classNameOf,
		getFeetY: getFeetY,
		getFloorOffset: getFloorOffset,
		getCarHalfLength: getCarHalfLength,
		unwrapEntity: unwrapEntity,
		getEntityId: getEntityId,
		getX: getX,
		getY: getY,
		getZ: getZ,
		getYaw: getYaw,
		getRawSpeed: getRawSpeed,
		getSpeedKmh: getSpeedKmh,
		getSpeedMps: getSpeedMps,
		readBogie: readBogie,
		readCantDegrees: readCantDegrees,
		readCantFromSamples: readCantFromSamples,
		isSwitchCore: isSwitchCore,
		getSwitchCore: getSwitchCore,
		readDataMapDouble: readDataMapDouble,
		readRollsigns: readRollsigns,
		bindRollsignTexture: bindRollsignTexture,
		restoreAfterRollsign: restoreAfterRollsign,
		restoreEngineRollsigns: restoreEngineRollsigns,
		normalizePartialTick: normalizePartialTick
	};
})();
