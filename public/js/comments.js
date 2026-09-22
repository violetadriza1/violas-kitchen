// Handles the comment form on the recipe detail page via the Fetch API,
// so a new comment appears without a full page reload.
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('comment-form');
  if (!form) return;

  const list = document.getElementById('comment-list');
  const countEl = document.getElementById('comment-count');
  const messageEl = document.getElementById('comment-form-message');
  const recipeId = form.dataset.recipeId;

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    messageEl.textContent = '';

    const author_name = document.getElementById('author_name').value.trim();
    const comment_text = document.getElementById('comment_text').value.trim();

    if (!author_name || !comment_text) {
      messageEl.textContent = 'Please fill in both fields.';
      return;
    }

    try {
      const response = await fetch(`/recipes/${recipeId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author_name, comment_text }),
      });

      const data = await response.json();

      if (!response.ok) {
        messageEl.textContent = data.error || 'Something went wrong. Please try again.';
        return;
      }

      // Append the new comment to the list without reloading the page.
      const li = document.createElement('li');
      li.className = 'comment';

      const strong = document.createElement('strong');
      strong.textContent = data.comment.author_name;

      const p = document.createElement('p');
      p.textContent = data.comment.comment_text;

      li.appendChild(strong);
      li.appendChild(p);
      list.appendChild(li);

      countEl.textContent = String(Number(countEl.textContent) + 1);

      form.reset();
      messageEl.textContent = 'Comment posted!';
    } catch (err) {
      messageEl.textContent = 'Network error — please try again.';
    }
  });
});
