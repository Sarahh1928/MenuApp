// import "../../components/restaurant/resturant.css";
interface RestaurantInfoProps {
  isOpen: boolean;
  closingTime?: string;
  openingTime?: string;
  phone: string;
  whatsapp: string;
  address: string;
  locationUrl?: string;
}

function RestaurantInfo({
  isOpen,
  closingTime,
  openingTime,
  phone,
  whatsapp,
  address,
  locationUrl,
}: RestaurantInfoProps) {
  return (
    <section className="restaurant-info">
      <div className="restaurant-status-section">
        <div className={`restaurant-status ${isOpen ? "open" : "closed"}`}>
          <span className="restaurant-status-dot" />

          <span>
            {isOpen ? "Open now" : "Closed"}
          </span>
        </div>

        <span className="restaurant-hours-text">
          {isOpen && closingTime
            ? `Closes at ${closingTime}`
            : !isOpen && openingTime
              ? `Opens at ${openingTime}`
              : ""}
        </span>
      </div>

      <div className="restaurant-contact-actions">
        <a
          href={`tel:${phone}`}
          className="restaurant-info-button"
        >
          <span>📞</span>
          <span>Call</span>
        </a>

        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="restaurant-info-button whatsapp"
        >
          <span>💬</span>
          <span>WhatsApp</span>
        </a>

        {locationUrl && (
          <a
            href={locationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="restaurant-info-button"
          >
            <span>📍</span>
            <span>Location</span>
          </a>
        )}
      </div>

      <div className="restaurant-address">
        <span className="address-icon">📍</span>

        <div>
          <span className="address-label">Address</span>
          <p>{address}</p>
        </div>
      </div>
    </section>
  );
}

export default RestaurantInfo;