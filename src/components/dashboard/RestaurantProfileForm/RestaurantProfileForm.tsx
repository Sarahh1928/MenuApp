import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../../lib/supabase";
import { uploadImage } from "../../../lib/storage";
import type { Restaurant } from "../../../types/restaurant";
import "./RestaurantProfileForm.css";

interface RestaurantProfileFormProps {
  restaurantId: string;
}

function RestaurantProfileForm({ restaurantId }: RestaurantProfileFormProps) {
  const { t } = useTranslation();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
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

        const r = data as Restaurant;

        setRestaurant(r);
        setName(r.name);
        setDescription(r.description ?? "");
        setPhone(r.phone);
        setWhatsapp(r.whatsapp);
        setAddress(r.address);
        setLogoPreview(r.logo_url ?? "");
        setCoverPreview(r.cover_url ?? "");
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

      if (logoFile) {
        logoUrl = await uploadImage(logoFile, `${restaurantId}/profile`);
      }

      if (coverFile) {
        coverUrl = await uploadImage(coverFile, `${restaurantId}/profile`);
      }

      const { error: dbError } = await supabase
        .from("restaurants")
        .update({
          name: name.trim(),
          description: description.trim(),
          phone: phone.trim(),
          whatsapp: whatsapp.trim(),
          address: address.trim(),
          logo_url: logoUrl,
          cover_url: coverUrl,
        })
        .eq("id", restaurantId);

      if (dbError) {
        throw new Error(dbError.message);
      }

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
    return <p>{t("dashboard.profile.loading")}</p>;
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <label>
        {t("dashboard.profile.name")}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label>
        {t("dashboard.profile.description")}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <div className="profile-form-row">
        <label>
          {t("dashboard.profile.phone")}
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </label>

        <label>
          {t("dashboard.profile.whatsapp")}
          <input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            required
          />
        </label>
      </div>

      <label>
        {t("dashboard.profile.address")}
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
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

              if (file) {
                setLogoPreview(URL.createObjectURL(file));
              }
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

              if (file) {
                setCoverPreview(URL.createObjectURL(file));
              }
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
