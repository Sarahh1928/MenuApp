import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../../lib/supabase";
import type { RestaurantHours } from "../../../types/restaurant";
import "./HoursEditor.css";

const DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

interface HoursEditorProps {
  restaurantId: string;
}

function HoursEditor({ restaurantId }: HoursEditorProps) {
  const { t } = useTranslation();

  const [hours, setHours] = useState<RestaurantHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    supabase
      .from("restaurant_hours")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("day_of_week", { ascending: true })
      .then(({ data }) => {
        const existing = (data ?? []) as RestaurantHours[];

        // Fill in any missing days so all 7 always render.
        const filled = DAYS.map((_, i) => {
          const found = existing.find((h) => h.day_of_week === i);

          return (
            found ?? {
              day_of_week: i,
              open_time: "10:00",
              close_time: "22:00",
              is_closed: false,
            }
          );
        });

        setHours(filled);
        setLoading(false);
      });
  }, [restaurantId]);

  const updateDay = (index: number, patch: Partial<RestaurantHours>) => {
    setHours((current) =>
      current.map((h, i) => (i === index ? { ...h, ...patch } : h)),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    await supabase.from("restaurant_hours").upsert(
      hours.map((h) => ({
        ...h,
        restaurant_id: restaurantId,
      })),
      {
        onConflict: "restaurant_id,day_of_week",
      },
    );

    setSaving(false);
    setSaved(true);
  };

  if (loading) {
    return <p>{t("dashboard.hours.loading")}</p>;
  }

  return (
    <div className="hours-editor">
      {hours.map((h, i) => (
        <div key={h.day_of_week} className="hours-editor-row">
          <span className="hours-editor-day">
            {t(`dashboard.hours.days.${DAYS[h.day_of_week]}`)}
          </span>

          <label className="hours-editor-closed">
            <input
              type="checkbox"
              checked={h.is_closed}
              onChange={(e) =>
                updateDay(i, {
                  is_closed: e.target.checked,
                })
              }
            />

            {t("restaurant.closed")}
          </label>

          {!h.is_closed && (
            <div className="hours-editor-times">
              <input
                type="time"
                value={h.open_time ?? ""}
                onChange={(e) =>
                  updateDay(i, {
                    open_time: e.target.value,
                  })
                }
              />

              <span>{t("dashboard.hours.to")}</span>

              <input
                type="time"
                value={h.close_time ?? ""}
                onChange={(e) =>
                  updateDay(i, {
                    close_time: e.target.value,
                  })
                }
              />
            </div>
          )}
        </div>
      ))}

      {saved && <p className="profile-saved">{t("dashboard.hours.saved")}</p>}

      <button
        type="button"
        className="profile-save-btn"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? t("dashboard.hours.saving") : t("dashboard.hours.save")}
      </button>
    </div>
  );
}

export default HoursEditor;
