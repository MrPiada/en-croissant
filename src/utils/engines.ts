import { OS } from "@mantine/hooks";
import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs";
import { fetch } from "@tauri-apps/api/http";
import { invoke } from "./misc";

export interface Engine {
    name: string;
    version: string;
    path: string;
    image: string;
    elo: number | null;
    downloadSize?: number;
    downloadLink?: string;
    loaded?: boolean;
}

export async function getDefaultEngines(os: OS): Promise<Engine[]> {
    let bmi2: boolean = await invoke("is_bmi2_compatible");
    let data: any = await fetch(
        `https://www.encroissant.org/engines?os=${os}&bmi2=${bmi2}`,
        {
            method: "GET",
        }
    );
    if (!data.ok) {
        throw new Error("Failed to fetch engines");
    }
    return data.data;
}

export async function getEngines() {
    const text = await readTextFile("engines/engines.json", {
        dir: BaseDirectory.AppData,
    });
    if (text === "") {
        return [];
    }
    const data = JSON.parse(text);
    return data as Engine[];
}
