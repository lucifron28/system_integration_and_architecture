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
            const truncatedDescription = description.length > 100 ? description.substring(0, 100) + '...' : description;
            const bookPublisher = book.publisher ? book.publisher : 'Unknown Publisher';
            const bookCategories = book.categories ? book.categories.join(', ') : 'Unknown Category';
            bookDiv.classList.add('book');
            bookDiv.innerHTML = `
                <h3>${book.title}</h3>
                <p>${book.authors ? book.authors.join(', ') : 'Unknown Author'}</p>
                <p>Publisher: ${bookPublisher}</p>
                <p>Categories: ${bookCategories}</p>
                <img src="${thumbnail}" alt="Book Thumbnail">
                <p class="truncated-description">${truncatedDescription}</p>
                <p class="description">${description}</p>
                <span class="read-more">Read More</span>
            `;
            resultsDiv.appendChild(bookDiv);

            const readMore = bookDiv.querySelector('.read-more');
            const descriptionElem = bookDiv.querySelector('.description');
            const truncatedDescriptionElem = bookDiv.querySelector('.truncated-description');
            readMore.addEventListener('click', () => {
                if (descriptionElem.style.display === 'none' || descriptionElem.style.display === '') {
                    descriptionElem.style.display = 'block';
                    truncatedDescriptionElem.style.display = 'none';
                    readMore.textContent = 'Read Less';
                } else {
                    descriptionElem.style.display = 'none';
                    truncatedDescriptionElem.style.display = 'block';
                    readMore.textContent = 'Read More';
                }
            });
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});