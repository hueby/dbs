import * as fs from "fs";
import * as child from "child_process";
import { Config } from "./config";

export class Source {
    private chapterPath: string;
    private items: string[];
    private markdown: string;
    private resultFileName: string;
    private config: Config;

    constructor() {
        this.config = new Config();
        this.resultFileName = "result";
        this.chapterPath = this.getChapterPath();
        this.items = this.getChapters();
        this.fillMarkdown();
        this.convertToPDF();
    }

    private convertToPDF() {
        var exec = "pandoc ";
        exec += "-o " + this.resultFileName + ".pdf ";
        exec += this.resultFileName + ".md ";
        child.exec(exec);
    }

    private fillMarkdown() {
        var self = this;
        this.markdown = "";

        this.items.forEach((item, index) => {
            let subchapters = self.config.config.chapters[index];
            // let mds = fs.readdirSync(item);
            subchapters.forEach((md: any) => {
                let path = item + "/" + self.deCapitalizeFirstLetter(md) + ".md";
                let content = fs.readFileSync(path);
                self.markdown += "# " + md + "\n";
                self.markdown += content + "\n";
            });
        });

        fs.writeFileSync(this.resultFileName + ".md", this.markdown);
    }

    private capitalizeFirstLetterAndRemoveExt(word: string) {
        let uppercased = word.charAt(0).toUpperCase() + word.slice(1);
        return uppercased.split(".")[0];
    }

    private deCapitalizeFirstLetter(word: string) {
        let lowercased = word.charAt(0).toLowerCase() + word.slice(1);
        return lowercased;
    }

    private getChapters() {
        var self = this;
        let items = fs.readdirSync(this.chapterPath);
        return items.map((item: string) => {
            return self.chapterPath + "/" + item;
        });
    }

    private getChapterPath(): string {
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

