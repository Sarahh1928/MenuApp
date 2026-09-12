// import "../../components/restaurant/resturant.css";

interface RestaurantHeaderProps {
  name: string;
  description: string;
  image: string;
  logo?: string;
}

function RestaurantHeader({
  name,
  description,
  image,
  logo,
}: RestaurantHeaderProps) {
  return (
    <section className="restaurant-header">
      <img src={image} alt={name} className="restaurant-header-cover" />

      <div className="restaurant-header-overlay" />

      <div className="restaurant-header-content">
        <div className="restaurant-header-logo">
          {logo ? (
            <img src={logo} alt={`${name} logo`} />
          ) : (
            <span>{name.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div className="restaurant-header-text">
          <h1>{name}</h1>
          <p>{description}</p>
        </div>
      </div>
    </section>
  );
}

export default RestaurantHeader;
