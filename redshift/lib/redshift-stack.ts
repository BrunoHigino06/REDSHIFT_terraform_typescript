import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { aws_redshift as redshift } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class RedshiftStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const cfnCluster = new redshift.CfnCluster(this, 'mapfre_redshift_pipefy', {
      clusterType: 'single-node',
      dbName: 'mapfre_redshift_pipefy',
      masterUsername: 'admin',
      masterUserPassword: '!QAZ2wsx',
      nodeType: 'dc2.large',
    });
  }
}