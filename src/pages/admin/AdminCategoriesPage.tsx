import React, { useState } from 'react';
import {
  AlertCircle,
  Edit2,
  Package,
  PlusCircle,
  Trash2,
  X,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { StorageService } from '../../services/storage';
import { Category } from '../../types';

export const AdminCategoriesPage: React.FC = () => {
  const { categories, products, refreshData, addToast } = useShop();

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catToDelete, setCatToDelete] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [subcategoriesStr, setSubcategoriesStr] = useState('');

  const openCreateModal = () => {
    setName('');
    setSlug('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80');
    setSubcategoriesStr('General, Popular');
    setEditingCategory(null);
    setModalMode('create');
  };

  const openEditModal = (cat: Category) => {
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setImage(cat.image);
    setSubcategoriesStr(cat.subcategories.join(', '));
    setEditingCategory(cat);
    setModalMode('edit');
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Please enter category name.', 'error');
      return;
    }

    const calculatedSlug =
      slug.trim() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const subs = subcategoriesStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const categoryPayload: Category = {
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      slug: calculatedSlug,
      name: name.trim(),
      description: description.trim() || 'Exciting collection of toys.',
      iconName: 'Package',
      image: image.trim() || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
      subcategories: subs.length > 0 ? subs : ['General'],
    };

    StorageService.saveCategory(categoryPayload);
    refreshData();
    setModalMode(null);
    addToast(
      editingCategory ? `Category "${name}" updated!` : `Category "${name}" created!`,
      'success'
    );
  };

  const handleDeleteCategory = () => {
    if (!catToDelete) return;

    const res = StorageService.deleteCategory(catToDelete.id);
    if (!res.success) {
      addToast(res.error || 'Failed to delete category.', 'error');
      setCatToDelete(null);
      return;
    }

    refreshData();
    addToast(`Category "${catToDelete.name}" deleted.`, 'info');
    setCatToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Toy Categories ({categories.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize toy sections, subcategories, and cover imagery.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle size={16} />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.category === cat.slug).length;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="flex gap-4">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-16 h-16 rounded-2xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{cat.name}</h3>
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">
                    slug: /{cat.slug}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-extrabold">
                    {productCount} Products Assigned
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>

              {/* Subcategories tags */}
              <div className="flex flex-wrap gap-1">
                {cat.subcategories.map((sub) => (
                  <span key={sub} className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] text-slate-600 font-medium">
                    {sub}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => openEditModal(cat)}
                  className="text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => setCatToDelete(cat)}
                  className="text-slate-400 hover:text-rose-600 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setModalMode(null)} />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                {modalMode === 'create' ? 'Add New Category' : 'Edit Category'}
              </h3>
              <button onClick={() => setModalMode(null)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Remote Control Cars"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Slug URL (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. remote-control-cars"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cover Image URL *</label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subcategories (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Stunt Cars, Monster Trucks, Drift Cars"
                  value={subcategoriesStr}
                  onChange={(e) => setSubcategoriesStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {catToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setCatToDelete(null)} />
          <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl z-10 space-y-4">
            <h3 className="text-base font-black text-slate-900">Delete Category?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete "<strong className="text-slate-800">{catToDelete.name}</strong>"?
            </p>
            {products.some((p) => p.category === catToDelete.slug) && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-relaxed flex items-start gap-1.5">
                <AlertCircle size={15} className="shrink-0 mt-0.5 text-amber-600" />
                <span>
                  Safety Guard: There are active products assigned to this category. The system will prevent deletion until those products are reassigned.
                </span>
              </div>
            )}
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setCatToDelete(null)}
                className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
