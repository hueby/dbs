import * as fs from "fs";
import * as readline from "readline";

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export class Config {

    // TODO type this!
    public config: any;

    constructor() {
        let config = this.loadConfig()
        if(config !== null) {
            this.config = config;
        } else {
            console.log("Create a new config file");
            this.createConfig();
        }
    }

    private loadConfig() {
        let path = process.cwd();

        var cfg = null
        try {
            cfg = fs.readFileSync(path + "/config.json", "utf8"); 
            cfg = JSON.parse(cfg);
        } catch (ex) {
            console.error(JSON.stringify(ex));
        } finally {
            return cfg;
        }
    }

    private createConfig() {
        // parse title
        // parse author
        // parse chapters
        //  recognize structure
        //  get users sequence of subchapters

        var config: any = {};
        rl.question("Title: ", (answer) => {
            config.title = answer; 
            rl.close();
        });

        console.log(JSON.stringify(config));

    }


}
