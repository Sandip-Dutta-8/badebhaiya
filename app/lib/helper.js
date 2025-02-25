// Helper function to convert entries to markdown
export function entriesToMarkdownWE(entries, type) {
    if (!entries?.length) return "";

    return (
        `## ${type}\n` +
        entries
            .map((entry) => {
                const dateRange = entry.current
                    ? `${entry.startDate} - Present`
                    : `${entry.startDate} - ${entry.endDate}`;
                return `### • **${entry.title} @ ${entry.organization}** <span style="float:right;">${dateRange}</span>\n\n- ${entry.description.replace(/\n/g, "\n- ")}`;
            })
            .join("\n\n")
    );
}
export function entriesToMarkdownEDU(entries, type) {
    if (!entries?.length) return "";

    return (
        `## ${type}\n` +
        entries
            .map((entry) => {
                const dateRange = entry.current
                    ? `${entry.startDate} - Present`
                    : `${entry.startDate} - ${entry.endDate}`;
                return `### • **${entry.organization}**\n&nbsp;&nbsp;&nbsp;&nbsp;**${entry.title}** <span style="float:right;">${dateRange}</span>\n\n- ${entry.description.replace(/\n/g, "\n- ")}`;
            })
            .join("\n\n")
    );
}
export function entriesToMarkdownPRO(entries, type) {
    if (!entries?.length) return "";

    return (
        `## ${type}\n` +
        entries
            .map((entry) => {
                const dateRange = entry.current
                    ? `${entry.startDate} - Present`
                    : `${entry.startDate} - ${entry.endDate}`;
                return `### • **${entry.title} - ${entry.organization}** <span style="float:right;">${dateRange}</span>\n\n- ${entry.description.replace(/\n/g, "\n- ")}`;
            })
            .join("\n\n")
    );
}