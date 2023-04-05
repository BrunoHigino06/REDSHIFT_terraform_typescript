#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { RedshiftStack } from '../lib/redshift-stack';

const app = new cdk.App();
new RedshiftStack(app, 'RedshiftStack');
