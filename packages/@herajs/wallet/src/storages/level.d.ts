declare module 'level' {
    import { LevelUp } from 'levelup';
    function level(filename: string, config: any): LevelUp;
    export = level;
}