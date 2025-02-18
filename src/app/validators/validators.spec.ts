import { dateGreaterThanOrEqualValidator } from "./validators";
import { AbstractControl } from "@angular/forms";

describe("dateGreaterThanOrEqualValidator", () => {
    let validatorFn: any;

    beforeEach(() => {
        validatorFn = dateGreaterThanOrEqualValidator();
    });

    it("should return null if control value is empty", () => {
        const control = { value: null } as AbstractControl;
        expect(validatorFn(control)).toBeNull();
    });

    it("should return null if date is in the future", () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        const control = { value: futureDate.toISOString().split("T")[0] } as AbstractControl;
        expect(validatorFn(control)).toBeNull();
    });

    it("should return an error object if date is in the past", () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);
        const control = { value: pastDate.toISOString().split("T")[0] } as AbstractControl;
        expect(validatorFn(control)).toEqual({ dateInvalid: true });
    });

    it("should correctly validate different date formats", () => {
        const validDate = "2030-12-31";
        const invalidDate = "1999-01-01";

        expect(validatorFn({ value: validDate } as AbstractControl)).toBeNull();
        expect(validatorFn({ value: invalidDate } as AbstractControl)).toEqual({ dateInvalid: true });
    });
});
