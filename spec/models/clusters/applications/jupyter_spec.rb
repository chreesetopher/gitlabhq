require 'rails_helper'

describe Clusters::Applications::Jupyter do
  include_examples 'cluster application core specs', :clusters_applications_jupyter
  include_examples 'cluster application status specs', :clusters_applications_jupyter
  include_examples 'cluster application helm specs', :clusters_applications_jupyter

  it { is_expected.to belong_to(:oauth_application) }

  describe '#set_initial_status' do
    before do
      jupyter.set_initial_status
    end

    context 'when ingress is not installed' do
      let(:cluster) { create(:cluster, :provided_by_gcp) }
      let(:jupyter) { create(:clusters_applications_jupyter, cluster: cluster) }

      it { expect(jupyter).to be_not_installable }
    end

    context 'when ingress is installed and external_ip is assigned' do
      let(:ingress) { create(:clusters_applications_ingress, :installed, external_ip: '127.0.0.1') }
      let(:jupyter) { create(:clusters_applications_jupyter, cluster: ingress.cluster) }

      it { expect(jupyter).to be_installable }
    end
  end

  describe '#install_command' do
    let!(:ingress) { create(:clusters_applications_ingress, :installed, external_ip: '127.0.0.1') }
    let!(:jupyter) { create(:clusters_applications_jupyter, cluster: ingress.cluster) }

    subject { jupyter.install_command }

    it { is_expected.to be_an_instance_of(Gitlab::Kubernetes::Helm::InstallCommand) }

    it 'should be initialized with 4 arguments' do
      expect(subject.name).to eq('jupyter')
      expect(subject.chart).to eq('jupyter/jupyterhub')
      expect(subject.version).to eq('v0.6')
      expect(subject).to be_rbac
      expect(subject.repository).to eq('https://jupyterhub.github.io/helm-chart/')
      expect(subject.files).to eq(jupyter.files)
    end

    context 'on a non rbac enabled cluster' do
      before do
        jupyter.cluster.platform_kubernetes.abac!
      end

      it { is_expected.not_to be_rbac }
    end

    context 'application failed to install previously' do
      let(:jupyter) { create(:clusters_applications_jupyter, :errored, version: '0.0.1') }

      it 'should be initialized with the locked version' do
        expect(subject.version).to eq('v0.6')
      end
    end
  end

  describe '#files' do
    let(:application) { create(:clusters_applications_jupyter) }
    let(:values) { subject[:'values.yaml'] }

    subject { application.files }

    it 'should include valid values' do
      expect(values).to include('ingress')
      expect(values).to include('hub')
      expect(values).to include('rbac')
      expect(values).to include('proxy')
      expect(values).to include('auth')
      expect(values).to include('singleuser')
      expect(values).to match(/clientId: '?#{application.oauth_application.uid}/)
      expect(values).to match(/callbackUrl: '?#{application.callback_url}/)
    end

    context 'when cluster belongs to a project' do
      it 'sets GitLab project id' do
        expect(values).to match(/GITLAB_CLUSTER_ID: '?#{application.cluster.id}/)
      end
    end
  end
end
