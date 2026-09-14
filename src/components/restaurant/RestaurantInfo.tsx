import { useTranslation } from "react-i18next";
import { formatTime } from "../../lib/openStatus";

interface RestaurantInfoProps {
  isOpen: boolean;
  closingTime?: string;
  openingTime?: string;
  openingDayOffset?: number;
  phone: string;
  whatsapp: string;
  address: string;
  locationUrl?: string;
}

function RestaurantInfo({
  isOpen,
  closingTime,
  openingTime,
  openingDayOffset,
  phone,
  whatsapp,
  address,
  locationUrl,
}: RestaurantInfoProps) {
  const { t } = useTranslation();

  const amLabel = t("restaurant.am");
  const pmLabel = t("restaurant.pm");
  const openingDayLabel =
    openingDayOffset === 0
      ? ""
      : openingDayOffset === 1
        ? t("restaurant.tomorrow")
        : openingDayOffset !== undefined
          ? t("restaurant.dayOffset", { count: openingDayOffset })
          : "";

  return (
    <section className="restaurant-info">
      <div className="restaurant-status-section">
        <div className={`restaurant-status ${isOpen ? "open" : "closed"}`}>
          <span className="restaurant-status-dot" />
          <span>
            {isOpen ? t("restaurant.openNow") : t("restaurant.closed")}
          </span>
        </div>

        <span className="restaurant-hours-text">
          {isOpen &&
            closingTime &&
            `${t("restaurant.closesAt")} ${formatTime(closingTime, amLabel, pmLabel)}`}
          {!isOpen &&
            openingTime &&
            `${t("restaurant.opensAt")} ${openingDayLabel ? openingDayLabel + " " : ""}${formatTime(openingTime, amLabel, pmLabel)}`}
        </span>
      </div>

      <div className="restaurant-contact-actions">
        <a href={`tel:${phone}`} className="restaurant-info-button">
          <span>📞</span>
          <span>{t("restaurant.call")}</span>
        </a>

        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="restaurant-info-button whatsapp"
        >
          <span>💬</span>
          <span>{t("restaurant.whatsapp")}</span>
        </a>

        {locationUrl && (
          <a
            href={locationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="restaurant-info-button"
          >
            <span>📍</span>
            <span>{t("restaurant.location")}</span>
          </a>
        )}
      </div>

      <div className="restaurant-address">
        <span className="address-icon">📍</span>
        <div>
          <span className="address-label">{t("restaurant.addressLabel")}</span>
          <p>{address}</p>
        </div>
      </div>
    </section>
  );
}

export default RestaurantInfo;
