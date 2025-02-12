// =============================================================================
// ABMZ_RepeatAttack.js
// Version: 1.00
// -----------------------------------------------------------------------------
// Copyright (c) 2019 ヱビ
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
// -----------------------------------------------------------------------------
// [Homepage]: ヱビのノート
//             http://www.zf.em-net.ne.jp/~ebi-games/
// =============================================================================


/*:
 * @plugindesc v1.00 ランダム回数攻撃プラグイン
 * @target MZ
 * @author ヱビ
 *
 * 
 * 
 * @help
 * ============================================================================
 * 機能
 * ============================================================================
 * 
 * 技術の能力値に応じて、ランダム回数攻撃できるプラグイン
 * 
 * 
 * ============================================================================
 * 更新履歴
 * ============================================================================
 * 
 * Version 1.00 公開
 *   
 * 
 * ============================================================================
 * 利用規約
 * ============================================================================
 * 
 * ・MITライセンスです。
 * ・クレジット表記は不要
 * ・営利目的で使用可
 * ・ソースコードのライセンス表示以外は改変可
 * ・素材だけの再配布も可
 * ・アダルトゲーム、残酷なゲームでの使用も可
 * 
 * 
 */

(function() {
	var parameters = PluginManager.parameters('ABMZ_RepeatAttack');


//=============================================================================
// 攻撃回数が技により増加
//=============================================================================

var _Game_Action_prototype_repeatTargets = Game_Action.prototype.repeatTargets;
Game_Action.prototype.repeatTargets = function(targets) {
    if (!this.item().meta.AGIRepeats) {
    	for (const target of targets) {
			if (target) {
    			target._decreaseDamageByRepeats = false;
			}
    	}
		return _Game_Action_prototype_repeatTargets.call(this, targets);
	}
	const subject = this.subject();
    const repeatedTargets = [];
    const agiRepeats = Number(this.item().meta.AGIRepeats) || 0;
    // console.log("luk:" + subject.luk + ", def:" + target.def  +", atk:" + subject.atk + ", kisochi:" + (agiRepeats + (subject.luk * 10 - target.def * 4) / subject.atk));
    for (const target of targets) {
        if (target) {
        	let repeats = 1;
        	if (this.isMagical()){
        		// 魔法   同じ能力値の場合1～2ヒット
	        	repeats = Math.floor(Math.min(8, Math.max(1, agiRepeats + (subject.mat * 5 - target.mdf * 4) / subject.mat + Math.random())));
            } else {
            	// 物理技 同じ能力値の場合1～2ヒット
	        	repeats = Math.floor(Math.min(3, Math.max(1, agiRepeats + Math.min(1, 4 * subject.mp / (subject.mmp + 1)) - Math.min(1, 4 * target.mp / (target.mmp + 1)) + (subject.luk * 10 - target.def * 4) / subject.atk + Math.random())));
            }
            // ２ヒット以上の場合、威力を0.75倍にするフラグを立てる
            if (repeats > 1) {
            	target._decreaseDamageByRepeats = true;
            } else {
            	target._decreaseDamageByRepeats = false;
            }
            for (let i = 0; i < repeats; i++) {
                repeatedTargets.push(target);
            }
        }
    }
    return repeatedTargets;
};
let _Game_Action_prototype_makeDamageValue = Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue = function(target, critical) {
	value = _Game_Action_prototype_makeDamageValue.call(this, target, critical);
	if (target._decreaseDamageByRepeats) value *= 0.75;
    value = Math.round(value);
	return value;
};
})();
