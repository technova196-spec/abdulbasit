import React, { useState } from 'react';
import {
  Boxes,
  Edit2,
  Minus,
  Plus,
  PlusCircle,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { StorageService } from '../../services/storage';
import { Product } from '../../types';

export const AdminProductsPage: React.FC = () => {
  const { products, categories, formatPrice, refreshData, addToast } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    slug: '',
    description: '',
    category: categories[0]?.slug || 'educational-toys',
    subcategory: '',
    price: 1500,
    salePrice: undefined,
    stock: 20,
    sku: '',
    ageRecommendation: '3-8 Years',
    brand: 'WonderToys',
    images: ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
  });

  const openCreateModal = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      category: categories[0]?.slug || 'educational-toys',
      subcategory: 'General',
      price: 2500,
      salePrice: undefined,
      stock: 15,
      sku: `TOY-${Math.floor(1000 + Math.random() * 9000)}`,
      ageRecommendation: '3-8 Years',
      brand: 'WonderLand',
      images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80'],
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
    });
    setEditingProduct(null);
    setModalMode('create');
  };

  const openEditModal = (prod: Product) => {
    setFormData({ ...prod });
    setEditingProduct(prod);
    setModalMode('edit');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.sku?.trim()) {
      addToast('Please provide a valid product name and SKU.', 'error');
      return;
    }

    const slug =
      formData.slug?.trim() ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      slug,
      name: formData.name.trim(),
      description: formData.description?.trim() || 'Quality toy set for children.',
      category: formData.category || 'educational-toys',
      subcategory: formData.subcategory || 'General',
      images: formData.images && formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'],
      price: Number(formData.price) || 1000,
      salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
      currency: 'PKR',
      stock: Math.max(0, Number(formData.stock) || 0),
      sku: formData.sku.trim().toUpperCase(),
      ageRecommendation: formData.ageRecommendation || '3-8 Years',
      brand: formData.brand || 'WonderToys',
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewCount: editingProduct ? editingProduct.reviewCount : 1,
      isFeatured: Boolean(formData.isFeatured),
      isBestSeller: Boolean(formData.isBestSeller),
      isNewArrival: Boolean(formData.isNewArrival),
      tags: [formData.category || '', 'toys', 'kids'],
      specifications: editingProduct?.specifications || [
        { key: 'Material', value: 'BPA-Free Child Safe Plastic' },
        { key: 'Warranty', value: '7-Day Replacement' },
      ],
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    StorageService.saveProduct(productPayload);
    refreshData();
    setModalMode(null);
    addToast(
      editingProduct
        ? `Product "${productPayload.name}" updated!`
        : `Product "${productPayload.name}" added to catalog!`,
      'success'
    );
  };

  const handleDeleteProduct = () => {
    if (!productToDelete) return;
    StorageService.deleteProduct(productToDelete.id);
    refreshData();
    addToast(`Product "${productToDelete.name}" deleted.`, 'info');
    setProductToDelete(null);
  };

  const handleStockAdjust = (prodId: string, delta: number) => {
    StorageService.updateProductStock(prodId, delta);
    refreshData();
  };

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Products Catalog ({products.length})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your store's toy collection, pricing, stock levels, and promotions.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle size={16} />
          <span>Add New Toy</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search toy by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-amber-400 outline-hidden"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-semibold shrink-0">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-hidden"
          >
            <option value="All">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-bold">Product</th>
                <th className="py-3 px-4 font-bold">SKU</th>
                <th className="py-3 px-4 font-bold">Category</th>
                <th className="py-3 px-4 font-bold">Price</th>
                <th className="py-3 px-4 font-bold">Stock</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={prod.images[0]}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover bg-slate-50 border border-slate-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 truncate max-w-xs">{prod.name}</h4>
                      <span className="text-[11px] text-slate-400">{prod.brand} • {prod.ageRecommendation}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">{prod.sku}</td>
                  <td className="py-3 px-4 text-slate-600 capitalize">
                    {categories.find((c) => c.slug === prod.category)?.name || prod.category}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-extrabold text-slate-900 block">
                      {formatPrice(prod.salePrice ?? prod.price)}
                    </span>
                    {prod.salePrice && (
                      <span className="text-[10px] text-slate-400 line-through">
                        {formatPrice(prod.price)}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStockAdjust(prod.id, -1)}
                        disabled={prod.stock <= 0}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                        title="Reduce stock by 1"
                      >
                        <Minus size={11} />
                      </button>
                      <span
                        className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${
                          prod.stock === 0
                            ? 'bg-rose-100 text-rose-700 font-extrabold'
                            : prod.stock <= 5
                            ? 'bg-amber-100 text-amber-800'
                            : 'text-slate-800'
                        }`}
                      >
                        {prod.stock}
                      </span>
                      <button
                        onClick={() => handleStockAdjust(prod.id, 1)}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                        title="Increase stock by 1"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {prod.stock === 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold">
                        Sold Out
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
                        title="Edit product"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setProductToDelete(prod)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setModalMode(null)} />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">
                {modalMode === 'create' ? 'Add New Toy Product' : 'Edit Toy Product'}
              </h3>
              <button
                onClick={() => setModalMode(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MagnaCraft 100-Piece 3D Magnetic Building Tiles"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="MAG-100-BLK"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MagnaCraft"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subcategory</label>
                  <input
                    type="text"
                    placeholder="e.g. Magnetic Tiles"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Regular Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sale Price (Optional PKR)</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="Leave empty if not on sale"
                    value={formData.salePrice || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salePrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Inventory Stock *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age Recommendation</label>
                  <input
                    type="text"
                    placeholder="e.g. 3-8 Years"
                    value={formData.ageRecommendation}
                    onChange={(e) => setFormData({ ...formData, ageRecommendation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Primary Image URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={formData.images?.[0] || ''}
                    onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Product Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the toy features, skills taught, and accessories included..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Status checkboxes */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-amber-500"
                  />
                  <span>Featured Toy</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="rounded text-amber-500"
                  />
                  <span>Best Seller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="rounded text-amber-500"
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {modalMode === 'create' ? 'Create Toy' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setProductToDelete(null)} />
          <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl z-10 space-y-4">
            <h3 className="text-base font-black text-slate-900">Delete Toy Product?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to remove "<strong className="text-slate-800">{productToDelete.name}</strong>" from the catalog? This will also remove it from any active user carts.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
              >
                Keep Product
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
