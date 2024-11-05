import FooterComponent from '../components/FooterComponent';
import '../assets/css/News.css';
import NewsBox from '../components/NewsBox';
import { useState } from 'react';

const News = () => {	
	const [showCount, setShowCount] = useState(3);

	const newsTable = [
		{
			title: 'News 1 - A random title',
			subtitle: 'News 1 subtitle- A random subtitle',
			content: 'News 1 content: dolar sit amet, consectetur adipiscing elit. Nulla nec odio nec urna posuere lacinia. Nullam',
			image: 'https://via.placeholder.com/300x170',
			link: 'https://www.google.com',
			date: '2024-10-01',
		}
	];

	const newsSections = () => {
		let latest = [];
		let old = [];

		newsTable.map((news) => {
			const newsDate = new Date(news.date);
			const weekAgo = new Date(new Date().setDate(new Date().getDate() - 7));

			if (newsDate < weekAgo) {
				old.push(news);
			} else {
				latest.push(news);
			}
		});
		return [latest, old];
	}

	const [latest, old] = newsSections();


	return (
		<>
			<div className='news-container'>
				<h3 className='title'>Latest News</h3>
				{
					latest?.length !== 0 ? latest.map((news, index) => {
						if (index + 1 > showCount) return;
						return <NewsBox key={index} {...news} />
					}) : <h3 className='nothing-see'>Nothing to show up here</h3>
				}

				<h3 className='title'>Old News</h3>
				{
					old?.length !== 0 ? old.map((news, index) => {
						if (index + 1 > showCount) return;
						return <NewsBox key={index} {...news} />
					}) : <h3 className='nothing-see'>Nothing to show up here</h3>
				}

				{
					old?.length > showCount ?
						<div className='view-more' onClick={() => setShowCount(showCount + 3)}>
							<svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
								<path d="M13.3122 3.00024H12.1403C12.0606 3.00024 11.9856 3.03931 11.9388 3.10337L7.49971 9.22212L3.06065 3.10337C3.01377 3.03931 2.93877 3.00024 2.85908 3.00024H1.68721C1.58565 3.00024 1.52627 3.11587 1.58565 3.19868L7.09502 10.794C7.29502 11.069 7.7044 11.069 7.90283 10.794L13.4122 3.19868C13.4731 3.11587 13.4138 3.00024 13.3122 3.00024Z" fill="#1890FF" />
							</svg>
							View more
						</div> : null
				}
			</div>
			<FooterComponent />
		</>
	);
};


export default News;
