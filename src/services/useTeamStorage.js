import { useEffect, useState } from "react";

const TEAM_STORAGE_KEY = "pokemonTeam";

function getStoredTeam() {
    const savedTeam = localStorage.getItem(TEAM_STORAGE_KEY);

    if (!savedTeam) {
        return [];
    }

    try {
        const parsedTeam = JSON.parse(savedTeam);
        return Array.isArray(parsedTeam) ? parsedTeam : [];
    } catch {
        return [];
    }
}

export function useTeamStorage() {
    const [team, setTeam] = useState(getStoredTeam);

    useEffect(() => {
        localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(team));
    }, [team]);

    return [team, setTeam];
}
