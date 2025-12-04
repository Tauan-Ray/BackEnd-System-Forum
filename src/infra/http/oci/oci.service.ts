import { Injectable } from '@nestjs/common';
import { ConfigFileAuthenticationDetailsProvider } from 'oci-common';
import { ObjectStorageClient, requests } from 'oci-objectstorage';
import { CreatePreauthenticatedRequestDetails } from 'oci-objectstorage/lib/model';
import { ociConfig } from 'src/config/env';
import { UserService } from '../user/user.service';

@Injectable()
export class OciService {
  private provider: ConfigFileAuthenticationDetailsProvider;
  private client: ObjectStorageClient;
  private namespace: string | undefined;

  constructor(private userService: UserService) {
    this.provider = new ConfigFileAuthenticationDetailsProvider();
    this.client = new ObjectStorageClient({ authenticationDetailsProvider: this.provider });
  }

  async getNamespace(): Promise<string> {
    if (this.namespace) return this.namespace;

    const res = await this.client.getNamespace({});
    this.namespace = res.value;
    return this.namespace;
  }

  async createPresignedUploadUrl(userId: string) {
    await this.userService.findById(userId);

    const namespace = await this.getNamespace();
    const bucketName = ociConfig.OCI_BUCKET_NAME;

    const fileName = `users/${userId}.jpg`;

    const createPreauthenticatedRequestDetails = {
      name: `par-${Date.now}`,
      accessType: CreatePreauthenticatedRequestDetails.AccessType.ObjectReadWrite,
      objectName: fileName,
      timeExpires: new Date(Date.now() + 3600 * 1000),
    };

    const res = await this.client.createPreauthenticatedRequest({
      namespaceName: namespace,
      bucketName,
      createPreauthenticatedRequestDetails,
    });

    const accessUri = res.preauthenticatedRequest.accessUri;
    const region = ociConfig.OCI_REGION;
    const base = `https://objectstorage.${region}.oraclecloud.com`;

    const uploadUrl = `${base}${accessUri}`;
    const objectUrl = `${base}/n/${namespace}/b/${bucketName}/o/${encodeURIComponent(fileName)}`;

    await this.userService.modifyUpdateAtUser(userId);

    return { uploadUrl, objectUrl, expiresAt: res.preauthenticatedRequest.timeExpires };
  }

  async headObject(bucketName: string, objectName: string) {
    const namespace = await this.getNamespace();

    const request: requests.HeadObjectRequest = {
      namespaceName: namespace,
      bucketName,
      objectName,
    };

    return this.client.headObject(request);
  }

  async createPresignedDownloadUrl(
    bucketName: string,
    objectName: string,
    userId: string,
    expirationInSeconds = 900,
  ) {
    const namespace = await this.getNamespace();

    const details = {
      name: `par-get-${Date.now()}`,
      accessType: CreatePreauthenticatedRequestDetails.AccessType.ObjectRead,
      objectName,
      timeExpires: new Date(Date.now() + expirationInSeconds * 1000),
    };

    const res = await this.client.createPreauthenticatedRequest({
      namespaceName: namespace,
      bucketName,
      createPreauthenticatedRequestDetails: details,
    });

    const accessUri = res.preauthenticatedRequest.accessUri;
    const region = ociConfig.OCI_REGION;
    const base = `https://objectstorage.${region}.oraclecloud.com`;

    const downloadUrl = `${base}${accessUri}`;

    return { downloadUrl, expiresAt: res.preauthenticatedRequest.timeExpires };
  }
}
