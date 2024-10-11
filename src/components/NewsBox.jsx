import '../assets/css/NewsBox.css'

const NewsBox = (newsDetails) => {
	const { title, subtitle, content, link, image } = newsDetails;
	return (
		<div className="news-box">
			<div className="content-box">
				<h4>{title}</h4>
				<p>{subtitle}</p>
				<p>{content}</p>
				{
					link? <a href={link} target="_blank" rel="noopener noreferrer">Read More</a> : null
				}
			</div>
			<img src={image} alt={title} />
		</div>
	)
}

export default NewsBox