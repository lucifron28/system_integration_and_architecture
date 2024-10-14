document.getElementById('bookForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const author = document.getElementById('author').value;
    const title = document.getElementById('title').value;
    const publisher = document.getElementById('publisher').value;
    
    let query = `https://www.googleapis.com/books/v1/volumes?q=`;
    if (author) query += `inauthor:${author}`;
    if (title) query += `+intitle:${title}`;
    if (publisher) query += `+inpublisher:${publisher}`;
    query += `&key=AIzaSyCMb5zd7pu9kJE14Txu_r123A2E83yc8vY`; // Add API key here
    
    try {
        const response = await fetch(query);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        if (!data.items || data.items.length === 0) {
            resultsDiv.innerHTML = '<p>No results found.</p>';
            return;
        }

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
                <button class="share-button">Share</button>
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

            const shareButton = bookDiv.querySelector('.share-button');
            shareButton.addEventListener('click', async () => {
                const webhookUrl = 'https://mseufeduph.webhook.office.com/webhookb2/8ef714f6-81de-4b42-ad2e-c262d5ce04d1@ddedb3cc-596d-482b-8e8c-6cc149a7a7b7/IncomingWebhook/9ef0b875219140eb8135437505a9d31c/e0510d66-17c3-43f4-a3ef-0cf6a6fba189/V24duT1GXj0kuDCkgbXHPSG6tCe2ZunOnaM30gWrZrYuo1';
                const payload = {
                    text: `Book Title: ${book.title}\nAuthor: ${book.authors ? book.authors.join(', ') : 'Unknown Author'}\nPublisher: ${bookPublisher}\nCategories: ${bookCategories}\nDescription: ${description}`
                };
                try {
                    const webhookResponse = await fetch(webhookUrl, {
                        method: 'POST',
                        body: JSON.stringify(payload)
                    });
                    if (!webhookResponse.ok) {
                        throw new Error(`Webhook error! status: ${webhookResponse.status}`);
                    }
                    alert('Book details shared successfully!');
                } catch (webhookError) {
                    console.error('Error sharing book details:', webhookError);
                    alert('Error sharing book details. Please try again later.');
                }
            });
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '<p>Error fetching data. Please try again later.</p>';
    }
});