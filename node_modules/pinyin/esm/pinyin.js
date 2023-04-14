import PinyinBase, { getPinyinInstance } from "./PinyinBase";
import { segment } from "./segment";
export class Pinyin extends PinyinBase {
    segment(hans, segmentType) {
        return segment(hans, segmentType);
    }
}
export const pinyin = getPinyinInstance(new Pinyin());
export default pinyin;
export const compare = pinyin.compare;
export { compact } from "./util";
//# sourceMappingURL=pinyin.js.map