import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

const priorities = ['Low', 'Medium', 'High', 'Critical'];
const categories = ['Infrastructure', 'Application', 'Network', 'Security', 'Facilities', 'Other'];

export default function NewIncidentPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/incidents" className="inline-flex items-center gap-2 text-sm text-[#8b949e] hover:text-white transition-colors mb-3">
            <ArrowLeft size={16} /> Back to incidents
          </Link>
          <h1 className="text-2xl font-bold text-white">Create Incident</h1>
          <p className="text-[#8b949e] text-sm mt-1">Capture the details needed to triage and resolve a new incident.</p>
        </div>
      </div>

      <form className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-5">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-[#8b949e] mb-2" htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              required
              placeholder="Brief summary of the incident"
              className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-white placeholder:text-[#6e7681] focus:outline-none focus:border-[#6e40c9]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-[#8b949e] mb-2" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              required
              rows={8}
              placeholder="Describe the impact, symptoms, affected users, and any troubleshooting already performed."
              className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-white placeholder:text-[#6e7681] focus:outline-none focus:border-[#6e40c9] resize-y"
            />
          </div>
        </section>

        <aside className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-5 h-fit">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-[#8b949e] mb-2" htmlFor="priority">Priority</label>
            <select id="priority" name="priority" defaultValue="Medium" className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-white focus:outline-none focus:border-[#6e40c9]">
              {priorities.map(priority => <option key={priority}>{priority}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-[#8b949e] mb-2" htmlFor="category">Category</label>
            <select id="category" name="category" defaultValue="Infrastructure" className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-white focus:outline-none focus:border-[#6e40c9]">
              {categories.map(category => <option key={category}>{category}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-[#8b949e] mb-2" htmlFor="assignee">Assignee</label>
            <input id="assignee" name="assignee" placeholder="Unassigned" className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-white placeholder:text-[#6e7681] focus:outline-none focus:border-[#6e40c9]" />
          </div>

          <div className="flex gap-3 pt-2">
            <Link href="/incidents" className="flex-1 px-4 py-2 border border-[#30363d] rounded-lg text-sm text-center text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors">
              Cancel
            </Link>
            <button type="submit" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#6e40c9] rounded-lg text-sm text-white font-medium hover:bg-purple-700 transition-colors">
              <Save size={14} /> Save
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}
