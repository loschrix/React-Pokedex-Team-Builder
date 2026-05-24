import { TeamMember } from "../TeamMember/TeamMember.jsx";

export default function TeamSidebar({ team, onRemoveFromTeam }) {
    return (
        <aside className="team-column">
            <div className="team-column__header">
                <h2>MY TEAM</h2>
                <span className="team-column__counter">
                    {team.length}/6
                </span>
            </div>

            <div className="team-column__content custom-scrollbar">
                <div className="team-list">
                    {team.length !== 0 &&
                        team.map((pokemon, index) => (
                            <TeamMember
                                key={pokemon.id}
                                pokemon={pokemon}
                                index={index}
                                onRemove={onRemoveFromTeam}
                            />
                        ))
                    }
                </div>
            </div>
        </aside>
    );
}