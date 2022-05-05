async function getpost() {
	
}

window.onload = getpost;
document.getElementById('title').addEventListener('submit', async (e) => {
	e.preventDefault();
	const title = e.target.title.value;
	const writings = e.target.writings.value;
	if(!title){
		alert('제목을 입력하세요');
	} else if (!writings){
		alert('내용을 입력하세요');
	}
	try {
		await axios.post('/posting', { title, writings });
		getpost();
	} catch (err) {
		console.error(err);
	}
	e.target.title.value='';
})
