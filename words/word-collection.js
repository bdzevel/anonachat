class WordCollection
{
	constructor(words)
	{
		// TODO: Check parameter type?
		this.Words = words;
		this.Length = words.length;
	}
	
	GetRandomWord()
	{
		let index = Math.floor(Math.random() * this.Length);
		let word = this.Words[index];
		return word;
	}
}

module.exports = WordCollection;