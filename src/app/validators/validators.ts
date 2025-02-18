import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateGreaterThanOrEqualValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        const currentDate = new Date();
        const selectedDate = new Date(control.value);

        if (selectedDate < currentDate) {
            return { dateInvalid: true };
        }

        return null;
    };
}