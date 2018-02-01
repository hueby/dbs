import * as fs from "fs";
import * as child from 'child_process';

export class Source {
    private chapterPath: string;
    private items: string[];
    private markdown: string;
    private resultFileName: string;

    constructor() {
        var self = this;
        this.resultFileName = "result";
        this.chapterPath = this.getChapterPath();
        this.items = this.getChapters();
        this.fillMarkdown();
        this.convertToPDF();
    }

    public convertToPDF() {
        child.exec("pandoc -o " + this.resultFileName + ".pdf " + this.resultFileName + ".md");
    }

    public fillMarkdown() {
        var self = this;
        this.markdown = "";

        this.items.forEach((item) => {
            let mds = fs.readdirSync(item);
            mds.forEach((md) => {
                let path = item + "/" + md;
                let content = fs.readFileSync(path);
                self.markdown += "# " + self.capitalizeFirstLetterAndRemoveExt(md) + "\n";
                self.markdown += content + "\n";
            });
        });

        fs.writeFileSync(this.resultFileName + ".md", this.markdown);
    }

    private capitalizeFirstLetterAndRemoveExt(word: string) {
        let uppercased = word.charAt(0).toUpperCase() + word.slice(1);
        return uppercased.split(".")[0];
    }

    public getChapters() {
        var self = this;
        let items = fs.readdirSync(this.chapterPath);
        return items.map((item: string) => {
            return self.chapterPath + "/" + item;
        });
    }

    public getChapterPath(): string {
        let currentPath = process.cwd();
        let chapters = currentPath + "/chapters";
        try {
            fs.statSync(chapters);
            return chapters;
        } catch (ex) {
            console.error(JSON.stringify(ex));
            return ""; 
        }
    }

    private log(message: any) {
        console.log(JSON.stringify(message));
    }
}

