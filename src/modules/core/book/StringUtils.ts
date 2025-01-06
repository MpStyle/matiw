export class StringUtils{
    public static capitalize=(word: string) =>{
        if (!word) return word;
        return word[0].toUpperCase() + word.substring(1).toLowerCase();
    }
}