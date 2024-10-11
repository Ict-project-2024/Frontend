import FooterComponent from '../components/FooterComponent';
import '../assets/css/News.css';
import NewsBox from '../components/NewsBox';

const News = () => {
	const newsTable = [
		{
			title: 'News 1 - A random title',
			subtitle: 'News 1 subtitle- A random subtitle',
			content: 'News 1 content: dolar sit amet, consectetur adipiscing elit. Nulla nec odio nec urna posuere lacinia. Nullam',
			image: 'https://via.placeholder.com/300x170',
			link: 'https://www.google.com',
			date: '2021-09-01',
		},
		{
			title: 'News 2 - A random title',
			subtitle: 'News 2 subtitle- A random subtitle',
			content: 'News 2 content: dolar sit amet, consectetur adipiscing elit. Nulla nec odio nec urna posuere lacinia. Nullam',
			image: 'https://via.placeholder.com/300x170',
			date: '2021-09-01',
		},
		{
			title: 'News 3 - A random title',
			subtitle: 'News 3 subtitle- A random subtitle',
			content: 'News 3 content: dolar sit amet, consectetur adipiscing elit. Nulla nec odio nec urna posuere lacinia. Nullam ',
			image: 'https://via.placeholder.com/300x170',
			link: 'https://www.google.com',
			date: '2021-09-01',
		},
		{
			title: 'News 4 - A random title',
			subtitle: 'News 4 subtitle- A random subtitle',
			content: 'News 4 content: dolar sit amet, consectetur adipiscing elit. Nulla nec odio nec urna posuere lacinia. Nullam',
			image: 'https://via.placeholder.com/300x170',
			date: '2021-09-01',
		},
	];

	return (
		<div className='news-container'>
			<h3 className='title'>Latest News</h3>
			{
				newsTable.map((news, index) => {
					return <NewsBox key={index} {...news} />
				})
			}
			<h3 className='title'>Old News</h3>
			<FooterComponent />
		</div>

	);

};

export default News;
