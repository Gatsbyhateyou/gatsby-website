/**
 * 灵感垃圾桶与 Supabase 的桥接：提供 save / load，未配置时由调用方回退到 localStorage。
 */
(function () {
  var url = typeof window !== 'undefined' && window.__SUPABASE_URL__;
  var key = typeof window !== 'undefined' && window.__SUPABASE_ANON_KEY__;
  var supabaseLib = typeof window !== 'undefined' && window.supabase;

  if (!url || !key || !supabaseLib) {
    window.ideaBinApi = null;
    return;
  }

  var client = supabaseLib.createClient(url, key);
  var TABLE = 'inspirations';

  window.ideaBinApi = {
    /** 保存一条灵感，返回 { id, timestamp } 或抛出错误 */
    save: function (content) {
      return client
        .from(TABLE)
        .insert({ content: content })
        .select('id, created_at')
        .single()
        .then(function (res) {
          if (res.error) throw res.error;
          return {
            id: res.data.id,
            timestamp: formatTimestamp(res.data.created_at)
          };
        });
    },
    /** 拉取列表，按时间倒序，返回 { id, content, timestamp }[] */
    load: function () {
      return client
        .from(TABLE)
        .select('id, content, created_at')
        .order('created_at', { ascending: false })
        .then(function (res) {
          if (res.error) throw res.error;
          return (res.data || []).map(function (row) {
            return {
              id: row.id,
              content: row.content,
              timestamp: formatTimestamp(row.created_at)
            };
          });
        });
    },
    /** 按 id 删除一条灵感 */
    delete: function (id) {
      return client
        .from(TABLE)
        .delete()
        .eq('id', id)
        .then(function (res) {
          if (res.error) throw res.error;
        });
    }
  };

  function formatTimestamp(createdAt) {
    if (!createdAt) return '';
    try {
      return new Date(createdAt).toLocaleString();
    } catch (e) {
      return createdAt;
    }
  }
})();
