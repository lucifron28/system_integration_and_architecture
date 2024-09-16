document.getElementById('bookForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const author = document.getElementById('author').value;
    const title = document.getElementById('title').value;
    const publisher = document.getElementById('publisher').value;
    
    let query = `https://www.googleapis.com/books/v1/volumes?q=`;
    if (author) query += `inauthor:${author}`;
    if (title) query += `+intitle:${title}`;
    if (publisher) query += `+inpublisher:${publisher}`;
    
    try {
        const response = await fetch(query);
        const data = await response.json();
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';
        data.items.forEach(item => {
            const book = item.volumeInfo;
            const bookDiv = document.createElement('div');
            const thumbnail = book.imageLinks ? book.imageLinks.thumbnail : 'No Image Available';
            const description = book.description ? book.description : 'No Description Available';
            const bookPublisher = book.publisher ? book.publisher : 'Unknown Publisher';
            bookDiv.innerHTML = `
                <div class='book'>
                <h3>${book.title}</h3>
                <p>${book.authors ? book.authors.join(', ') : 'Unknown Author'}</p>
                <p>Publisher: ${bookPublisher}</p>
                <img src="${thumbnail}" alt="Book Thumbnail">
                <p>${description}</p>
                </div>
            `;
            resultsDiv.appendChild(bookDiv);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});