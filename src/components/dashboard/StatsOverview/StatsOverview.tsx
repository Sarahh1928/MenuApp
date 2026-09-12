import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../../lib/supabase";
import { useMenuStats } from "../../../hooks/useMenuStats";
import "./StatsOverview.css";

interface StatsOverviewProps {
  restaurantId: string;
}

function StatsOverview({ restaurantId }: StatsOverviewProps) {
  const { t } = useTranslation();
  const { data, loading, error } = useMenuStats(restaurantId, 14);
  const [totalViews, setTotalViews] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("restaurants")
      .select("view_count")
      .eq("id", restaurantId)
      .single()
      .then(({ data }) => setTotalViews(data?.view_count ?? 0));
  }, [restaurantId]);

  const maxCount = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="stats-overview">
      <div className="stats-total-card">
        <span>{t("dashboard.stats.totalViews")}</span>
        <strong>{totalViews ?? "—"}</strong>
      </div>

      {loading && <p>{t("dashboard.stats.loading")}</p>}

      {error && (
        <p className="dashboard-error">
          {t("dashboard.stats.error", { error })}
        </p>
      )}

      {!loading && !error && (
        <div className="stats-chart">
          {data.length === 0 && (
            <p className="menu-items-empty">{t("dashboard.stats.noViews")}</p>
          )}

          {data.map((d) => (
            <div key={d.day} className="stats-bar-col">
              <div
                className="stats-bar"
                style={{
                  height: `${(d.count / maxCount) * 100}%`,
                }}
                title={t("dashboard.stats.views", {
                  count: d.count,
                })}
              />

              <span className="stats-bar-label">
                {new Date(d.day).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StatsOverview;
