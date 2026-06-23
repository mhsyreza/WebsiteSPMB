import { useEffect, useState } from 'react';
import { Bell, AlertTriangle, Calendar } from 'lucide-react';
import { supabase, type Pengumuman as Peng } from '../lib/supabase';

export default function Pengumuman() {
  const [items, setItems] = useState<Peng[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('pengumuman')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setItems(data);
        setLoading(false);
      });
  }, []);

  return (
    <section id="pengumuman" className="py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase">
            Info Terkini
          </span>
          <h2 className="font-display font-black text-4xl text-gray-900 mb-3">Pengumuman</h2>
          <p className="text-gray-500">Informasi penting seputar PPDB SMK Media Teknologi</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Belum ada pengumuman</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className={`card-tilt rounded-2xl p-6 border-l-4 shadow-sm animate-slide-up ${
                  item.penting
                    ? 'bg-red-50 border-l-red-500'
                    : 'bg-white border-l-gray-200'
                }`}
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    item.penting ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    {item.penting
                      ? <AlertTriangle className="w-5 h-5 text-red-500" />
                      : <Bell className="w-5 h-5 text-gray-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {item.penting && (
                        <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide badge-pulse">
                          Penting
                        </span>
                      )}
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </span>
                    </div>
                    <h3 className={`font-display font-bold text-lg mb-1 ${item.penting ? 'text-red-800' : 'text-gray-900'}`}>
                      {item.judul}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.isi}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
