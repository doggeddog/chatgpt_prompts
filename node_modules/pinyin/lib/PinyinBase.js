"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPinyinInstance = void 0;
var dict_zi_1 = __importDefault(require("./data/dict-zi")); // 单个汉字拼音数据。
var phrases_dict_1 = __importDefault(require("./data/phrases-dict")); // 词组拼音数据。
var segment_web_1 = require("./segment-web");
var format_1 = require("./format");
var surname_1 = __importDefault(require("./data/surname"));
var compound_surname_1 = __importDefault(require("./data/compound_surname"));
var util_1 = require("./util");
var constant_1 = require("./constant");
var PinyinBase = /** @class */ (function () {
    function PinyinBase() {
        // 兼容 v2.x 中的属性透出
        // pinyin styles:
        this.STYLE_TONE = constant_1.ENUM_PINYIN_STYLE.TONE;
        this.STYLE_TONE2 = constant_1.ENUM_PINYIN_STYLE.TONE2;
        this.STYLE_TO3NE = constant_1.ENUM_PINYIN_STYLE.TO3NE;
        this.STYLE_NORMAL = constant_1.ENUM_PINYIN_STYLE.NORMAL;
        this.STYLE_INITIALS = constant_1.ENUM_PINYIN_STYLE.INITIALS;
        this.STYLE_FIRST_LETTER = constant_1.ENUM_PINYIN_STYLE.FIRST_LETTER;
        // 兼容 v2.x 中的属性透出
        // pinyin mode:
        this.MODE_NORMAL = constant_1.ENUM_PINYIN_MODE.NORMAL;
        this.MODE_SURNAME = constant_1.ENUM_PINYIN_MODE.SURNAME;
    }
    // MODE_PLACENAME = ENUM_PINYIN_MODE.PLACENAME;
    /**
     * 拼音转换入口。
     */
    PinyinBase.prototype.pinyin = function (hans, options) {
        if (typeof hans !== "string") {
            return [];
        }
        var opt = (0, util_1.convertUserOptions)(options);
        var pys;
        if (opt.mode === constant_1.ENUM_PINYIN_MODE.SURNAME) {
            pys = this.surname_pinyin(hans, opt);
        }
        else {
            // 因为分词结果有词性信息，结构不同，处理也不相同，所以需要分别处理。
            if (opt.segment) {
                // 分词加词性标注转换。
                pys = this.segment_pinyin(hans, opt);
            }
            else {
                // 单字拆分转换。连续的非中文字符作为一个词（原样输出，不转换成拼音）。
                pys = this.normal_pinyin(hans, opt);
            }
        }
        if (options === null || options === void 0 ? void 0 : options.compact) {
            pys = (0, util_1.compact)(pys);
        }
        return pys;
    };
    /**
     * 不使用分词算法的拼音转换。
     */
    PinyinBase.prototype.normal_pinyin = function (hans, options) {
        var pys = [];
        var nohans = "";
        for (var i = 0, l = hans.length; i < l; i++) {
            var words = hans[i];
            var firstCharCode = words.charCodeAt(0);
            if (dict_zi_1.default[firstCharCode]) {
                // 处理前面的“非中文”部分。
                if (nohans.length > 0) {
                    pys.push([nohans]);
                    nohans = ""; // 重置“非中文”缓存。
                }
                pys.push(this.single_pinyin(words, options));
            }
            else {
                nohans += words;
            }
        }
        // 清理最后的非中文字符串。
        if (nohans.length > 0) {
            pys.push([nohans]);
            nohans = ""; // reset non-chinese words.
        }
        return pys;
    };
    /**
     * 单字拼音转换。
     * @param {String} han, 单个汉字
     * @return {Array} 返回拼音列表，多音字会有多个拼音项。
     */
    PinyinBase.prototype.single_pinyin = function (han, options) {
        if (typeof han !== "string") {
            return [];
        }
        if (han.length !== 1) {
            return this.single_pinyin(han.charAt(0), options);
        }
        var hanCode = han.charCodeAt(0);
        if (!dict_zi_1.default[hanCode]) {
            return [han];
        }
        var pys = dict_zi_1.default[hanCode].split(",");
        if (!options.heteronym) {
            return [(0, format_1.toFixed)(pys[0], options.style)];
        }
        // 临时存储已存在的拼音，避免多音字拼音转换为非注音风格出现重复。
        var py_cached = {};
        var pinyins = [];
        for (var i = 0, l = pys.length; i < l; i++) {
            var py = (0, format_1.toFixed)(pys[i], options.style);
            if ((0, util_1.hasKey)(py_cached, py)) {
                continue;
            }
            py_cached[py] = py;
            pinyins.push(py);
        }
        return pinyins;
    };
    PinyinBase.prototype.segment = function (hans, segmentType) {
        return (0, segment_web_1.segment)(hans, segmentType);
    };
    /**
     * 将文本分词，并转换成拼音。
     */
    PinyinBase.prototype.segment_pinyin = function (hans, options) {
        var phrases = this.segment(hans, options.segment);
        var pys = [];
        var nohans = "";
        for (var i = 0, l = phrases.length; i < l; i++) {
            var words = phrases[i];
            var firstCharCode = words.charCodeAt(0);
            if (dict_zi_1.default[firstCharCode]) {
                // ends of non-chinese words.
                if (nohans.length > 0) {
                    pys.push([nohans]);
                    nohans = ""; // reset non-chinese words.
                }
                var newPys = words.length === 1
                    ? this.normal_pinyin(words, options)
                    : this.phrases_pinyin(words, options);
                if (options.group) {
                    pys.push(this.groupPhrases(newPys));
                }
                else {
                    pys = pys.concat(newPys);
                }
            }
            else {
                nohans += words;
            }
        }
        // 清理最后的非中文字符串。
        if (nohans.length > 0) {
            pys.push([nohans]);
            nohans = ""; // reset non-chinese words.
        }
        return pys;
    };
    /**
     * 词语注音
     * @param {String} phrases, 指定的词组。
     * @param {Object} options, 选项。
     * @return {Array}
     */
    PinyinBase.prototype.phrases_pinyin = function (phrases, options) {
        var py = [];
        if ((0, util_1.hasKey)(phrases_dict_1.default, phrases)) {
            //! copy pinyin result.
            phrases_dict_1.default[phrases].forEach(function (item, idx) {
                py[idx] = [];
                if (options.heteronym) {
                    item.forEach(function (py_item, py_index) {
                        py[idx][py_index] = (0, format_1.toFixed)(py_item, options.style);
                    });
                }
                else {
                    py[idx][0] = (0, format_1.toFixed)(item[0], options.style);
                }
            });
        }
        else {
            for (var i = 0, l = phrases.length; i < l; i++) {
                py.push(this.single_pinyin(phrases[i], options));
            }
        }
        return py;
    };
    PinyinBase.prototype.groupPhrases = function (phrases) {
        if (phrases.length === 1) {
            return phrases[0];
        }
        var grouped = (0, util_1.combo)(phrases);
        return grouped;
    };
    // 姓名转成拼音
    PinyinBase.prototype.surname_pinyin = function (hans, options) {
        return this.compound_surname(hans, options);
    };
    // 复姓处理
    PinyinBase.prototype.compound_surname = function (hans, options) {
        var len = hans.length;
        var prefixIndex = 0;
        var result = [];
        for (var i = 0; i < len; i++) {
            var twowords = hans.substring(i, i + 2);
            if ((0, util_1.hasKey)(compound_surname_1.default, twowords)) {
                if (prefixIndex <= i - 1) {
                    result = result.concat(this.single_surname(hans.substring(prefixIndex, i), options));
                }
                var pys = compound_surname_1.default[twowords].map(function (item) {
                    return item.map(function (ch) { return (0, format_1.toFixed)(ch, options.style); });
                });
                result = result.concat(pys);
                i = i + 2;
                prefixIndex = i;
            }
        }
        // 处理复姓后面剩余的部分。
        result = result.concat(this.single_surname(hans.substring(prefixIndex, len), options));
        return result;
    };
    // 单姓处理
    PinyinBase.prototype.single_surname = function (hans, options) {
        var result = [];
        for (var i = 0, l = hans.length; i < l; i++) {
            var word = hans.charAt(i);
            if ((0, util_1.hasKey)(surname_1.default, word)) {
                var pys = surname_1.default[word].map(function (item) {
                    return item.map(function (ch) { return (0, format_1.toFixed)(ch, options.style); });
                });
                result = result.concat(pys);
            }
            else {
                result.push(this.single_pinyin(word, options));
            }
        }
        return result;
    };
    /**
     * 比较两个汉字转成拼音后的排序顺序，可以用作默认的拼音排序算法。
     *
     * @param {String} hanA 汉字字符串 A。
     * @return {String} hanB 汉字字符串 B。
     * @return {Number} 返回 -1，0，或 1。
     */
    PinyinBase.prototype.compare = function (hanA, hanB) {
        var pinyinA = this.pinyin(hanA);
        var pinyinB = this.pinyin(hanB);
        return String(pinyinA).localeCompare(String(pinyinB));
    };
    PinyinBase.prototype.compact = function (pys) {
        return (0, util_1.compact)(pys);
    };
    return PinyinBase;
}());
exports.default = PinyinBase;
function getPinyinInstance(py) {
    var pinyin = py.pinyin.bind(py);
    pinyin.compare = py.compare.bind(py);
    pinyin.compact = py.compact.bind(py);
    // pinyin styles: 兼容 v2.x 中的属性透出
    pinyin.STYLE_TONE = constant_1.ENUM_PINYIN_STYLE.TONE;
    pinyin.STYLE_TONE2 = constant_1.ENUM_PINYIN_STYLE.TONE2;
    pinyin.STYLE_TO3NE = constant_1.ENUM_PINYIN_STYLE.TO3NE;
    pinyin.STYLE_NORMAL = constant_1.ENUM_PINYIN_STYLE.NORMAL;
    pinyin.STYLE_INITIALS = constant_1.ENUM_PINYIN_STYLE.INITIALS;
    pinyin.STYLE_FIRST_LETTER = constant_1.ENUM_PINYIN_STYLE.FIRST_LETTER;
    // pinyin mode: 兼容 v2.x 中的属性透出
    pinyin.MODE_NORMAL = constant_1.ENUM_PINYIN_MODE.NORMAL;
    pinyin.MODE_SURNAME = constant_1.ENUM_PINYIN_MODE.SURNAME;
    // pinyin.MODE_PLACENAME = ENUM_PINYIN_MODE.PLACENAME;
    return pinyin;
}
exports.getPinyinInstance = getPinyinInstance;
//# sourceMappingURL=PinyinBase.js.map