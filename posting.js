async function getpost() {
	const res = await axios.get('/getpost');
	const postings = res.data;
	const title = document.createElement('h3');
	const writings = document.createElement('h4');
	const div = document.createElement('div');
	const posts = document.getElementById('posts');
	Object.keys(postings).map(function(key) {
		title.textContent = postings[key].title;
		writings.textContent = postings[key].writings;
		div.appendChild(title);
		div.appendChild(writings);
		div.id = key;
		posts.appendChild(div);
	})
}

window.onload = getpost;
document.getElementById('post').addEventListener('submit', async (e) => {
	e.preventDefault();
	const title = e.target.title.value;
	const writings = e.target.writings.value;
	if(!title || !writings){
		alert('내용을 입력하세요');
	} else{
		try {
		await axios.post('/posting', { title, writings });
		getpost();
		} catch (err) {
			console.error(err);
		}
		e.target.title.value='';
		e.target.writings.value='';
	}
})
