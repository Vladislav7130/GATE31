const postsContainer = document.getElementById('postsContainer');
const filterInput = document.getElementById('filterInput');
const filterButton = document.getElementById('filterButton');
const selectedCount = document.getElementById('selectedCount');
const loadingIndicator = document.querySelector('.loading-indicator');
let posts = [];

// Fetch posts from API
async function fetchPosts() {
    try {
        loadingIndicator.style.display = 'inline';
        filterButton.disabled = true;
        filterInput.disabled = true;

        const response = await fetch('https://jsonplaceholder.typicode.com/posts/?_start=0&_limit=7');
        posts = await response.json();
        renderPosts(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
    } finally {
        loadingIndicator.style.display = 'none';
        filterButton.disabled = false;
        filterInput.disabled = false;
    }
}

// Render posts to the DOM
function renderPosts(postsToRender) {
    postsContainer.innerHTML = '';
    postsToRender.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <input type="checkbox" class="post-checkbox">
            <h3>${post.title}</h3>
            <p>${post.body}</p>
        `;
        postsContainer.appendChild(postElement);
    });
    updateSelectedCount();
}

// Filter posts by title
function filterPosts() {
    const filterValue = filterInput.value.toLowerCase();
    const filteredPosts = posts.filter(post => post.title.toLowerCase().includes(filterValue));
    renderPosts(filteredPosts);
    updateUrl(filterValue);
}

// Update the URL with the filter value
function updateUrl(filterValue) {
    const url = new URL(window.location);
    url.searchParams.set('filter', filterValue);
    window.history.pushState({}, '', url);
}

// Update the selected posts count
function updateSelectedCount() {
    const selectedPosts = document.querySelectorAll('.post-checkbox:checked').length;
    selectedCount.textContent = selectedPosts;
}

// Event listeners
filterButton.addEventListener('click', filterPosts);
postsContainer.addEventListener('change', (event) => {
    const postElement = event.target.closest('.post');
    if (postElement) {
        postElement.classList.toggle('selected', event.target.checked);
        updateSelectedCount();
    }
});

// Initialize the page
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const filterValue = urlParams.get('filter') || '';
    filterInput.value = filterValue;
    fetchPosts().then(() => {
        filterPosts();
    });
});