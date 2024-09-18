document.getElementById('dictionaryForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const word = document.getElementById('word').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            throw new Error('Word not found');
        }
        const data = await response.json();
        const meanings = data[0].meanings;

        meanings.forEach(meaning => {
            const partOfSpeech = meaning.partOfSpeech;
            const definitions = meaning.definitions;

            definitions.forEach(definition => {
                const definitionDiv = document.createElement('div');
                definitionDiv.classList.add('definition');
                definitionDiv.innerHTML = `
                    <p><strong>${partOfSpeech}</strong>: ${definition.definition}</p>
                    ${definition.example ? `<p><em>Example:</em> ${definition.example}</p>` : ''}
                `;
                resultsDiv.appendChild(definitionDiv);
            });
        });
    } catch (error) {
        resultsDiv.innerHTML = `<p>${error.message}</p>`;
    }
});