import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../../lib/supabase";
import { uploadImage } from "../../../lib/storage";
import type { Restaurant } from "../../../types/restaurant";
import "./RestaurantProfileForm.css";
import Spinner from "../../common/Spinner";

interface RestaurantProfileFormProps {
  restaurantId: string;
}

function RestaurantProfileForm({ restaurantId }: RestaurantProfileFormProps) {
  const { t, i18n } = useTranslation();
  const uiDir = i18n.language === "ar" ? "rtl" : "ltr";

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [locationUrl, setLocationUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("restaurants")
      .select("*")
      .eq("id", restaurantId)
      .single()
      .then(({ data }) => {
        if (!data) return;
        const row = data as any;

        setRestaurant(row);
        setNameAr(row.name_ar ?? row.name ?? "");
        setNameEn(row.name_en ?? "");
        setDescriptionAr(row.description_ar ?? row.description ?? "");
        setDescriptionEn(row.description_en ?? "");
        setPhone(row.phone ?? "");
        setWhatsapp(row.whatsapp ?? "");
        setLocationUrl(row.location_url ?? "");
        setLogoPreview(row.logo_url ?? "");
        setCoverPreview(row.cover_url ?? "");
        setLoading(false);
      });
  }, [restaurantId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      let logoUrl = restaurant?.logo_url ?? null;
      let coverUrl = restaurant?.cover_url ?? null;

      if (logoFile)
        logoUrl = await uploadImage(logoFile, `${restaurantId}/profile`);
      if (coverFile)
        coverUrl = await uploadImage(coverFile, `${restaurantId}/profile`);

      const { error: dbError } = await supabase
        .from("restaurants")
        .update({
          name: nameAr.trim(),
          name_ar: nameAr.trim(),
          name_en: nameEn.trim() || null,
          description: descriptionAr.trim(),
          description_ar: descriptionAr.trim(),
          description_en: descriptionEn.trim() || null,
          phone: phone.trim(),
          whatsapp: whatsapp.trim(),
          location_url: locationUrl.trim() || null,
          logo_url: logoUrl,
          cover_url: coverUrl,
        })
        .eq("id", restaurantId);

      if (dbError) throw new Error(dbError.message);
      setSaved(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("dashboard.profile.error"),
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="dashboard-loading">
        <Spinner size={16} inline /> {t("dashboard.profile.loading")}
      </p>
    );
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="profile-form-row bilingual-row">
        <label className="field-en">
          <span className="field-label-row" dir={uiDir}>
            {t("dashboard.profile.nameEn")}
            <span className="field-optional">
              {t("dashboard.profile.optional")}
            </span>
          </span>
          <input
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            dir="ltr"
          />
        </label>

        <label className="field-ar">
          {t("dashboard.profile.nameAr")}
          <input
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            dir="rtl"
            required
          />
        </label>
      </div>

      <div className="profile-form-row bilingual-row">
        <label className="field-en">
          <span className="field-label-row" dir={uiDir}>
            {t("dashboard.profile.descriptionEn")}
            <span className="field-optional">
              {t("dashboard.profile.optional")}
            </span>
          </span>
          <textarea
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            dir="ltr"
          />
        </label>

        <label className="field-ar">
          {t("dashboard.profile.descriptionAr")}
          <textarea
            value={descriptionAr}
            onChange={(e) => setDescriptionAr(e.target.value)}
            dir="rtl"
          />
        </label>
      </div>

      <div className="profile-form-row">
        <label>
          {t("dashboard.profile.phone")}
          <input
            type="tel"
            className="ltr-field"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            dir="ltr"
            required
          />
        </label>

        <label>
          {t("dashboard.profile.whatsapp")}
          <input
            type="tel"
            className="ltr-field"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            dir="ltr"
            required
          />
        </label>
      </div>

      <label>
        {t("dashboard.profile.locationUrl")}
        <span className="field-hint">
          {t("dashboard.profile.locationUrlHint")}
        </span>
        <input
          type="url"
          className="ltr-field"
          value={locationUrl}
          onChange={(e) => setLocationUrl(e.target.value)}
          dir="ltr"
          placeholder="https://maps.google.com/?q=..."
        />
      </label>

      <div className="profile-form-row">
        <label>
          {t("dashboard.profile.logo")}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setLogoFile(file);
              if (file) setLogoPreview(URL.createObjectURL(file));
            }}
          />
          {logoPreview && (
            <img
              src={logoPreview}
              alt={t("dashboard.profile.logo")}
              className="profile-logo-preview"
            />
          )}
        </label>

        <label>
          {t("dashboard.profile.cover")}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setCoverFile(file);
              if (file) setCoverPreview(URL.createObjectURL(file));
            }}
          />
          {coverPreview && (
            <img
              src={coverPreview}
              alt={t("dashboard.profile.cover")}
              className="profile-cover-preview"
            />
          )}
        </label>
      </div>

      {error && <p className="dashboard-error">{error}</p>}
      {saved && <p className="profile-saved">{t("dashboard.profile.saved")}</p>}

      <button type="submit" className="profile-save-btn" disabled={saving}>
        {saving ? t("dashboard.profile.saving") : t("dashboard.profile.save")}
      </button>
    </form>
  );
}

export default RestaurantProfileForm;
