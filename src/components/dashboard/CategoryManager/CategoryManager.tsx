import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { localizedName } from "../../../lib/localize";
import type { Category } from "../../../types/restaurant";
import { useTranslation } from "react-i18next";
import "./CategoryManager.css";

interface CategoryManagerProps {
  restaurantId: string;
  categories: Category[];
  onChanged: () => void;
}

function CategoryManager({
  restaurantId,
  categories,
  onChanged,
}: CategoryManagerProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [newNameAr, setNewNameAr] = useState("");
  const [newNameEn, setNewNameEn] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNameAr, setEditNameAr] = useState("");
  const [editNameEn, setEditNameEn] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const handleAdd = async () => {
    const ar = newNameAr.trim();
    if (!ar) return;
    setSubmitting(true);

    await supabase.from("categories").insert({
      restaurant_id: restaurantId,
      name: ar,
      name_ar: ar,
      name_en: newNameEn.trim() || null,
      sort_order: categories.length,
    });

    setNewNameAr("");
    setNewNameEn("");
    setSubmitting(false);
    onChanged();
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm(t("dashboard.manager.confirmDelete"))) return;
    await supabase.from("categories").delete().eq("id", categoryId);
    onChanged();
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const target = categories[index + direction];
    const current = categories[index];
    if (!target) return;

    await Promise.all([
      supabase
        .from("categories")
        .update({ sort_order: target.sort_order })
        .eq("id", current.id),
      supabase
        .from("categories")
        .update({ sort_order: current.sort_order })
        .eq("id", target.id),
    ]);

    onChanged();
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditNameAr(cat.nameAr);
    setEditNameEn(cat.nameEn ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditNameAr("");
    setEditNameEn("");
  };

  const saveEdit = async () => {
    if (!editingId || !editNameAr.trim()) return;
    setSavingEdit(true);

    await supabase
      .from("categories")
      .update({
        name: editNameAr.trim(),
        name_ar: editNameAr.trim(),
        name_en: editNameEn.trim() || null,
      })
      .eq("id", editingId);

    setSavingEdit(false);
    cancelEdit();
    onChanged();
  };

  return (
    <div className="category-manager">
      <h3>{t("dashboard.manager.title")}</h3>

      <ul className="category-manager-list">
        {categories.map((cat, i) => {
          const primary = localizedName(cat, lang);
          const secondary = lang === "ar" ? cat.nameEn : cat.nameAr;

          return editingId === cat.id ? (
            <li key={cat.id} className="category-manager-edit-row">
              <input
                value={editNameAr}
                onChange={(e) => setEditNameAr(e.target.value)}
                placeholder={t("dashboard.manager.placeholderAr")}
              />
              <input
                value={editNameEn}
                onChange={(e) => setEditNameEn(e.target.value)}
                placeholder={t("dashboard.manager.placeholderEn")}
              />
              <div className="category-manager-actions">
                <button
                  type="button"
                  onClick={saveEdit}
                  disabled={savingEdit || !editNameAr.trim()}
                >
                  {t("dashboard.manager.save")}
                </button>
                <button type="button" onClick={cancelEdit}>
                  {t("dashboard.manager.cancel")}
                </button>
              </div>
            </li>
          ) : (
            <li key={cat.id}>
              <span>
                {primary}
                {secondary && (
                  <span className="category-name-en"> · {secondary}</span>
                )}
              </span>
              <div className="category-manager-actions">
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => handleMove(i, -1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={i === categories.length - 1}
                  onClick={() => handleMove(i, 1)}
                >
                  ↓
                </button>
                <button type="button" onClick={() => startEdit(cat)}>
                  ✎
                </button>
                <button type="button" onClick={() => handleDelete(cat.id)}>
                  ✕
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="category-manager-add">
        <input
          value={newNameAr}
          onChange={(e) => setNewNameAr(e.target.value)}
          placeholder={t("dashboard.manager.placeholderAr")}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <input
          value={newNameEn}
          onChange={(e) => setNewNameEn(e.target.value)}
          placeholder={t("dashboard.manager.placeholderEn")}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={submitting || !newNameAr.trim()}
        >
          {t("dashboard.manager.add")}
        </button>
      </div>
    </div>
  );
}

export default CategoryManager;
