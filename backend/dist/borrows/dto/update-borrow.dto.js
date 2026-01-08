"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBorrowDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_borrow_dto_1 = require("./create-borrow.dto");
class UpdateBorrowDto extends (0, mapped_types_1.PartialType)(create_borrow_dto_1.CreateBorrowDto) {
}
exports.UpdateBorrowDto = UpdateBorrowDto;
//# sourceMappingURL=update-borrow.dto.js.map