import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "../../../lib/supabase";
import { uploadImage } from "../../../lib/storage";
import type { MenuItem } from "../../../types/menu";
import type { Category } from "../../../types/restaurant";
import "./MenuItemForm.css";

interface MenuItemFormProps {
  restaurantId: string;
  categories: Category[];
  item: MenuItem | null;
  onSaved: () => void;
  onCancel: () => void;
}

function MenuItemForm({
  restaurantId,
  categories,
  item,
  onSaved,
  onCancel,
}: MenuItemFormProps) {
  const { t } = useTranslation();

  const [nameAr, setNameAr] = useState(item?.nameAr ?? "");
  const [nameEn, setNameEn] = useState(item?.nameEn ?? "");
  const [descriptionAr, setDescriptionAr] = useState(item?.descriptionAr ?? "");
  const [descriptionEn, setDescriptionEn] = useState(item?.descriptionEn ?? "");
  const [price, setPrice] = useState(item ? String(item.price) : "");
  const [categoryId, setCategoryId] = useState(
    item?.categoryId ?? categories[0]?.id ?? "",
  );
  const [available, setAvailable] = useState(item?.available ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(item?.image ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim() || !price || !categoryId) return;

    setSubmitting(true);
    setError(null);

    try {
      let imageUrl = item?.image ?? "";
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, `${restaurantId}/menu-items`);
      }

      const row = {
        restaurant_id: restaurantId,
        category_id: categoryId,
        name: nameAr.trim(),
        name_ar: nameAr.trim(),
        name_en: nameEn.trim() || null,
        description: descriptionAr.trim(),
        description_ar: descriptionAr.trim(),
        description_en: descriptionEn.trim() || null,
        price: Number(price),
        image_url: imageUrl,
        available,
      };

      const { error: dbError } = item
        ? await supabase.from("menu_items").update(row).eq("id", item.id)
        : await supabase.from("menu_items").insert(row);

      if (dbError) throw new Error(dbError.message);
      onSaved();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("dashboard.menuItems.error"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="menu-item-form-overlay" onClick={onCancel}>
      <form
        className="menu-item-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h3>
          {item ? t("dashboard.menuItems.edit") : t("dashboard.menuItems.new")}
        </h3>

        <label>
          {t("dashboard.menuItems.nameAr")}
          <input
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            required
          />
        </label>

        <label>
          {t("dashboard.menuItems.nameEn")}
          <span className="field-optional">
            {t("dashboard.menuItems.optional")}
          </span>
          <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
        </label>

        <label>
          {t("dashboard.menuItems.descriptionAr")}
          <textarea
            value={descriptionAr}
            onChange={(e) => setDescriptionAr(e.target.value)}
          />
        </label>

        <label>
          {t("dashboard.menuItems.descriptionEn")}
          <span className="field-optional">
            {t("dashboard.menuItems.optional")}
          </span>
          <textarea
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
          />
        </label>

        <div className="menu-item-form-row">
          <label>
            {t("dashboard.menuItems.price")}
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </label>

          <label>
            {t("dashboard.menuItems.category")}
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nameAr}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          {t("dashboard.menuItems.photo")}
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        {preview && (
          <img
            src={preview}
            alt={t("dashboard.menuItems.preview")}
            className="menu-item-form-preview"
          />
        )}

        <label className="menu-item-form-checkbox">
          <input
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
          />
          {t("dashboard.menuItems.available")}
        </label>

        {error && <p className="dashboard-error">{error}</p>}

        <div className="menu-item-form-actions">
          <button type="button" onClick={onCancel}>
            {t("dashboard.menuItems.cancel")}
          </button>
          <button type="submit" disabled={submitting}>
            {submitting
              ? t("dashboard.menuItems.saving")
              : t("dashboard.menuItems.save")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MenuItemForm;
