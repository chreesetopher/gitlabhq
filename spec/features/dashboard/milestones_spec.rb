require 'spec_helper'

describe 'Dashboard > Milestones' do
  describe 'as anonymous user' do
    before do
      visit dashboard_milestones_path
    end

    it 'is redirected to sign-in page' do
      expect(current_path).to eq new_user_session_path
    end
  end

  describe 'as logged-in user' do
    let(:user) { create(:user) }
    let(:group) { create(:group) }
    let(:project) { create(:project, namespace: user.namespace) }
    let!(:milestone) { create(:milestone, project: project) }
    let!(:milestone2) { create(:milestone, group: group) }

    before do
      group.add_developer(user)
      sign_in(user)
      visit dashboard_milestones_path
    end

    it 'sees milestones' do
      expect(current_path).to eq dashboard_milestones_path
      expect(page).to have_content(milestone.title)
      expect(page).to have_content(group.name)
    end
  end
end
