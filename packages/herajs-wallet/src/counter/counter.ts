export class Counter {
    private value: number = 0;

    getValue(): number {
        return this.value;
    }

    add(): void {
        this.value = this.value + 1;
    }

    subtract(): void {
        this.value = this.value - 1;
    }
}

