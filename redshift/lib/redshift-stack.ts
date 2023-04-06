import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { aws_redshift as redshift } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class RedshiftStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const PipefySubnetGroups = new redshift.CfnClusterSubnetGroup(this, 'PipefySubnetGroups', {
      description: 'subnets groups for the redshift cluster',
      subnetIds: ['subnet-0489ec3d142a8a4a2', 'subnet-071ad72cecd712e1b'],
      tags: [{
        key: 'Name',
        value: 'pipefy-subnet-groups',
      }],
    });

    const SubnetGroups = PipefySubnetGroups.attrClusterSubnetGroupName

    var randomstring = require("randomstring");
    var password = randomstring.generate()

    const ResdshiftClusterPassword = new secretsmanager.CfnSecret(this, 'ResdshiftClusterPassword', {
      description: 'Redshift Cluster Password',
      name: 'ResdshiftClusterPassword',
      secretString: password,
    });
    
    const mapfre_redshift_pipefy = new redshift.CfnCluster(this, 'mapfre_redshift_pipefy', {
      clusterType: 'single-node',
      dbName: 'mapfre_redshift_pipefy',
      masterUsername: 'administrator',
      masterUserPassword: password,
      nodeType: 'dc2.large',
      clusterSubnetGroupName: SubnetGroups,
    });

    mapfre_redshift_pipefy.addDependency(PipefySubnetGroups);
  }
}